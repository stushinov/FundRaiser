const FUND = artifacts.require("Fund");

contract("Funding", accounts => {

    const [firstAccount, secondAccount, thirdAccount] = accounts;
    const ETH_MULTIPLIER = 10**18;

    it('Creates a new "Fund" contract with no errors', async() => {
        const fund = await FUND.new(thirdAccount, "irrelevant");
    });

    it('Creates a new Fund with an owner = msg.sender', async () => {
        const fund = await FUND.new(secondAccount,"irrelevant", {from: secondAccount});
        let OWNER_FOUND = await fund.owner({from: firstAccount});
        assert.equal(OWNER_FOUND, secondAccount, 'Owner mismatch!');
    });

    it('Fund is able to receive funds.', async () => {
        const fund = await FUND.new(secondAccount,"irrelevant", {from: secondAccount});

        let firstEthDonation = 0.001 * ETH_MULTIPLIER;
        let secondEthDonation = 0.002 * ETH_MULTIPLIER;

        let allEthDonations = firstEthDonation + secondEthDonation;

        await fund.send(firstEthDonation, {from:secondAccount});
        await fund.send(secondEthDonation, {from: thirdAccount});

        let balanceOfFund = await fund.getBalance();

        assert.equal(balanceOfFund, allEthDonations, "Donated funds mismatch!");
    });

    it('Function "getAddress()" should return correct address.', async () => {
        const fund = await FUND.new(secondAccount,"irrelevant", {from: secondAccount});

        let addressFound = await fund.getAddress();

        assert.equal(fund.address, addressFound, 'Address mismatch!');
    });

    it('A donation to a Fund should emit an event.', async () => {
        const fund = await FUND.new(firstAccount, "irrelevant");

        let donation = await fund.send(1000, {from: firstAccount});

        let eventName = donation.logs[0].event;

        assert.equal(eventName, 'Donation', 'Event name mismatch');
        assert.equal(firstAccount, donation.logs[0].args.sender, 'Event name mismatch');
        assert.equal(1000, donation.logs[0].args.amount, 'Donation amount mismatch!');
    });

    it('When a fund is created the data variable should be assigned with whatever is passed', async () => {
        const fund = await FUND.new(firstAccount, "ReallyRelevantData");
        const dataExpected = "ReallyRelevantData";
        let dataFound = await fund.data();

        assert.equal(dataFound, dataExpected, "Mismatch of data stored");
    });

    it('Only the owner should be able to change the stored data!', async () => {

        const STORED_DATA = "relevantData";
        const fund = await FUND.new(thirdAccount, STORED_DATA, {from: thirdAccount});

        let error;
        try {
            await fund.setData('Someone trying to modify the data.', {from: firstAccount});
        }catch (e) {
            //Exception omitted.
            //Only the owner should be able to use setData()
            error = e;
        }

        assert.notEqual(error, undefined, "Someone changed the data in the contract!");
        assert.equal(await fund.data(), STORED_DATA, "Data stored in the contract has been changed!");

        const CHANGED_DATA = "Data changed!";

        await fund.setData(CHANGED_DATA, {from:thirdAccount});
        assert.equal(await fund.data(), CHANGED_DATA, "Data stored in the contract was not changed!");
    });
});