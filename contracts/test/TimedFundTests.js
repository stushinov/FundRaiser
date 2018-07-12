const TIMED_FUND = artifacts.require("TimedFund");

contract("TimedFund", accounts => {

    const ETH_MULTIPLIER = 10 ** 18;

    const ONE_ETHER = 1 * ETH_MULTIPLIER;

    const [firstAccount, secondAccount, thirdAccount] = accounts;

    const increaseTime = async function (seconds) {
        await web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [seconds],
            id: 1111
        });
    };

    it('Creating a donations fund should set correct time', async () => {
        let currentBlockTime = await web3.eth.getBlock('latest').timestamp;
        const fund = await TIMED_FUND.new(300, ONE_ETHER);

        let expiration = await fund.expires();
        let expectedExpiration = currentBlockTime + 300;

        assertUpToFiveSeconds(expectedExpiration, expiration);

        /**
         * This methods is used to eliminate the time differences that might occur from running the code.
         */
        function assertUpToFiveSeconds(expectedExpiration, expiration) {
            let expired = expiration > expectedExpiration - 5 && expiration < expectedExpiration + 5;
            assert.equal(true, expired, "Expiration mismatch!");
        }
    });

    it('A donation to a "TimedFund" should emit an event.', async () => {
        const fund = await TIMED_FUND.new(300, ONE_ETHER);
        let donation = await fund.send(1000, {from: firstAccount});

        let eventName = donation.logs[0].event;

        assert.equal(eventName, 'Donation', 'Event name mismatch');
        assert.equal(firstAccount, donation.logs[0].args.sender, 'Event name mismatch');
        assert.equal(1000, donation.logs[0].args.amount, 'Donation amount mismatch!');
    });

    it('TimedFund`s should be able to accept donations as long as it has not expired!', async () => {
        const fund = await TIMED_FUND.new(300, ONE_ETHER);
        await fund.send(1000, {from: secondAccount});

        increaseTime(10000);

        let error;

        try {
            await fund.send(100, {from: firstAccount});
        }
        catch (err) {
            error = err;
        }

        const EXPECTED_ERROR_MESSAGE = 'VM Exception while processing transaction: revert';
        assert.notEqual(error, undefined, 'Exception thrown');
        assert.equal(error.message, EXPECTED_ERROR_MESSAGE, 'Error mismatch!');
        assert.equal(await fund.getBalance(), 1000, 'Donations after time expiration occurred!');
    });


    it('Timed fund should set the correct target.', async () => {
        const fund = await TIMED_FUND.new(300, 1.25 * ETH_MULTIPLIER, {from: secondAccount});

        const EXPECTED_TARGET = 1.25 * ETH_MULTIPLIER; //1.25 ethers
        const TARGET_FOUND = await fund.target();

        assert.equal(TARGET_FOUND, EXPECTED_TARGET, "Target mismatch!");
    });

    it('Donations made to the "TimedFund" are recorded and have the correct amounts.', async () => {
        const fund = await TIMED_FUND.new(300, ONE_ETHER, {from: secondAccount});

        const TEN_THOUSAND_WEI = 10000;
        const TEN_WEI = 10;
        const ONE_MILLION_WEI = 1000000;

        await web3.eth.sendTransaction({
            from: secondAccount,
            to: fund.address,
            value: TEN_THOUSAND_WEI
        });

        await web3.eth.sendTransaction({
            from: firstAccount,
            to: fund.address,
            value: TEN_WEI
        });

        await web3.eth.sendTransaction({
            from: thirdAccount,
            to: fund.address,
            value: ONE_MILLION_WEI
        });

        let secondAccountDonation = await fund.getDonations(secondAccount);
        let firstAccountDonation = await fund.getDonations(firstAccount);
        let thirdAccountDonation = await fund.getDonations(thirdAccount);

        assert.equal(secondAccountDonation, TEN_THOUSAND_WEI, "Donation mismatch!");
        assert.equal(firstAccountDonation, TEN_WEI, "Donation mismatch!");
        assert.equal(thirdAccountDonation, ONE_MILLION_WEI, "Donation mismatch!");
    });

    it('Withdrawal function should send money to the owner', async () => {
        const fund = await TIMED_FUND.new(300, ONE_ETHER, {from: secondAccount});

        const TEN_ETHERS = 10 * ETH_MULTIPLIER;
        const FIVE_ETHERS = 5 * ETH_MULTIPLIER;

        await web3.eth.sendTransaction({
            from: secondAccount,
            to: fund.address,
            value: TEN_ETHERS
        });

        assert.equal(await fund.getBalance(), TEN_ETHERS, "Balance mismatch!");

        const EXPECTED_BALANCE = FIVE_ETHERS;

        await fund.withdrawal(FIVE_ETHERS, {from: secondAccount});

        assert.equal(await fund.getBalance(), FIVE_ETHERS, "Balance mismatch!");
    });

    it('Only the owner should be able to call the withdrawal function', async () => {
        const fund = await TIMED_FUND.new(300, ONE_ETHER, {from: secondAccount});

        const TEN_ETHERS = 10 * ETH_MULTIPLIER;
        const FIVE_ETHERS = 5 * ETH_MULTIPLIER;

        await web3.eth.sendTransaction({
            from: thirdAccount,
            to: fund.address,
            value: TEN_ETHERS
        });

        try {
            await fund.withdrawal(FIVE_ETHERS, {from: firstAccount});
        }
        catch (err) {
            //error was omitted.
            // No one but the owner of the contract should be able to successfully execute the "withdrawal" function.
        }

        assert.equal(await fund.getBalance(), TEN_ETHERS, "It was not the owner who called 'withdrawal'!");

        await fund.withdrawal(FIVE_ETHERS, {from: secondAccount});

        assert.equal(await fund.getBalance(), FIVE_ETHERS, "Balance mismatch!")
    });

    it('The "raised" variable should keep the total amount that was donated, no matter if the owner withdrawals funds', async () => {
        const fund = await TIMED_FUND.new(300, ONE_ETHER, {from: secondAccount});

        const TEN_ETHERS = 10 * ONE_ETHER;
        const FIVE_ETHERS = 5 * ONE_ETHER;

        await web3.eth.sendTransaction({
            from: thirdAccount,
            to: fund.address,
            value: TEN_ETHERS
        });

        await web3.eth.sendTransaction({
            from: firstAccount,
            to: fund.address,
            value: ONE_ETHER
        });

        await fund.withdrawal(FIVE_ETHERS, {from: secondAccount});

        const EXPECTED_RAISED_WEI = TEN_ETHERS + ONE_ETHER;
        const RAISED_WEI_FOUND = await fund.raised();

        assert.equal(EXPECTED_RAISED_WEI, RAISED_WEI_FOUND, "Raised amount mismatch!");
    });

    it('Owner should only be able to withdrawal if the goal of the funding is reached!', async () => {

        const TEN_ETHER = ONE_ETHER * 10;
        const NINE_ETHER = ONE_ETHER * 9;

        const fund = await TIMED_FUND.new(300, TEN_ETHER, {from: secondAccount});

        await web3.eth.sendTransaction({
            from: firstAccount,
            to: fund.address,
            value: NINE_ETHER
        });

        let error;
        try {
            await fund.withdrawal(ONE_ETHER, {from: secondAccount});
        }
        catch (err) {
            // Owner should be able to withdrawal if the goal was reached.
            error = err;
        }

        assert.notEqual(error, undefined, 'Owner withdrew funds before the goal was reached');

        await web3.eth.sendTransaction({
            from: thirdAccount,
            to: fund.address,
            value: ONE_ETHER
        });

        assert.equal(await fund.getBalance(), TEN_ETHER, "Donations mismatch!");

        await fund.withdrawal(NINE_ETHER, {from: secondAccount});

        assert.equal(await fund.getBalance(), ONE_ETHER, "Balance after withdrawal is not correct!");
    });

    it('The "refund" function should refund the ether of the callee only if a fund has expired and not reached its goal', async () => {

        const TEN_ETHER = 10 * ETH_MULTIPLIER;
        const FIVE_ETHER = 5 * ETH_MULTIPLIER;

        const fund = await TIMED_FUND.new(300, TEN_ETHER, {from: secondAccount});

        await web3.eth.sendTransaction({
            from: thirdAccount,
            to: fund.address,
            value: FIVE_ETHER
        });

        await web3.eth.sendTransaction({
            from: firstAccount,
            to: fund.address,
            value: ONE_ETHER
        });

        const DONATED_ETHER = FIVE_ETHER + ONE_ETHER;

        //Should return false if the refund failed.
        let result = await tryRefund(firstAccount);

        assert.equal(result, false, "A refund occurred! 0");
        assert.equal(await fund.getBalance(), DONATED_ETHER, "A refund occurred! 1");

        increaseTime(400);

        result = await tryRefund(firstAccount, fund);

        assert.equal(result, true, "A refund occurred! 2");
        assert.equal(await fund.getBalance(), DONATED_ETHER - ONE_ETHER, "A refund occurred! 3");
    });

    it('If the goal is reached the "refund" function should not be able to refund ether', async () => {
        const TEN_ETHER = 10 * ETH_MULTIPLIER;
        const fund = await TIMED_FUND.new(300, TEN_ETHER, {from: firstAccount});

        await web3.eth.sendTransaction({
            from: thirdAccount,
            to: fund.address,
            value: TEN_ETHER * 2 // 20 ETH
        });

        increaseTime(400);

        let refundResult = await tryRefund(thirdAccount, fund);

        assert.equal(refundResult, false, "A refund occurred!");
        assert.equal(await fund.getBalance(), TEN_ETHER * 2, "A refund occurred!");
    });

    async function tryRefund(withAccount, instance) {
        let refunded = true;
        try {
            await instance.refund({from: withAccount});
        }
        catch(err){
            return false;
        }
        return true;
    }
});