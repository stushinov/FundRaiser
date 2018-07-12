pragma solidity ^0.4.24;
import "truffle/Assert.sol";
import "../contracts/Funding.sol";
contract FundingFactoryTests {

    FundingFactory ff;

    function beforeEach() public {
        ff = new FundingFactory();
    }

    function testCreatinonOfTimedFund() public {
        address fundAddr = ff.createTimedFund(300, 10**18);
        TimedFund tf = TimedFund(fundAddr);
        string memory expected =  "TimedFund";
        Assert.equal(tf.getType(), expected, "Type mismatch!");
        Assert.equal(tf.target(), 10**18, "Target mismatch!");
    }
}
