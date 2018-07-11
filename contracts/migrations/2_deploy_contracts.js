const FUNDING_FACTORY = artifacts.require("FundingFactory");
module.exports = function(deployer){
    deployer.deploy(FUNDING_FACTORY);
};
