const Funding = artifacts.require("Funding");

contract("Funding", accounts => {
    const [firstAccount, secondAccount, thirdAccount] = accounts;

    it('Creates a new contract with no errors', async() => {
        const funding = await Funding.new();
    });
});