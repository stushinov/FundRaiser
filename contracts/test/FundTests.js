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
});