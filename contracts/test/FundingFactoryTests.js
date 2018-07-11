const FUNDING_FACTORY = artifacts.require("FundingFactory");

contract("FundingFactory", accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;

    it('Creates a new contract with no errors', async() => {
        const funding = await FUNDING_FACTORY.new();
    });
});