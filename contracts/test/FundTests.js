const FUND = artifacts.require("Fund");

contract("Funding", accounts => {

    const [firstAccount, secondAccount, thirdAccount] = accounts;
    const ETH_MULTIPLIER = 10**18;

    it('Creates a new "Fund" contract with no errors', async() => {
        const fund = await FUND.new();
    });

    it('Creates a new Fund with an owner = msg.sender', async () => {
        const fund = await FUND.new({from: secondAccount});

        let OWNER_FOUND = await fund.owner({from: firstAccount});

        assert.equal(OWNER_FOUND, secondAccount, 'Owner mismatch!');
    });

    it('Fund is able to receive funds.', async () => {
        const fund = await FUND.new({from: secondAccount});

        let firstEthDonation = 0.001 * ETH_MULTIPLIER;
        let secondEthDonation = 0.002 * ETH_MULTIPLIER;

        let allEthDonations = firstEthDonation + secondEthDonation;

        await fund.send(firstEthDonation, {from:secondAccount});
        await fund.send(secondEthDonation, {from: thirdAccount});

        let balanceOfFund = await fund.getBalance();

        assert.equal(balanceOfFund, allEthDonations, "Donated funds mismatch!");
    });

    it('Function "getAddress()" should return correct address.', async () => {
        const fund = await FUND.new({from: secondAccount});

        let addressFound = await fund.getAddress();

        assert.equal(fund.address, addressFound, 'Address mismatch!');
    });

    it('A donation to a Fund should emit an event.', async () => {
        const fund = await FUND.new();
        let donation = await fund.send(1000, {from: firstAccount});

        let eventName = donation.logs[0].event;


        assert.equal(eventName, 'Donation', 'Event name mismatch');
        assert.equal(firstAccount, donation.logs[0].args.sender, 'Event name mismatch');
        assert.equal(1000, donation.logs[0].args.amount, 'Event name mismatch');
    });
});