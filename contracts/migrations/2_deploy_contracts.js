const FUNDING_FACTORY = artifacts.require("FundingFactory");
const FUND = artifacts.require("Fund");

module.exports = function(deployer){
    deployer.deploy(FUNDING_FACTORY);
    deployer.deploy(FUND);
};
