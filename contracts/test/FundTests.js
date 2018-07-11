const FUND= artifacts.require("Fund");

contract("Funding", accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;

    it('Creates a new "Fund" contract with no errors', async() => {
        const fund = await FUND.new();
    });
});