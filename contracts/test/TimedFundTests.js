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
         * This methods is used to eliminate the differences that might occur from running the code.
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
});