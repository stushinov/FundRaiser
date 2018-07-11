const FUND= artifacts.require("Fund");

contract("Funding", accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;

    it('Creates a new "Fund" contract with no errors', async() => {
        const fund = await FUND.new();
    });

    it('Creates a new Fund with an owner = msg.sender', async () => {
        const fund = await FUND.new({from: secondAccount});

        let OWNER_FOUND = await fund.owner({from: firstAccount});

        assert.equal(OWNER_FOUND, secondAccount, 'Owner mismatch!');
    });
});