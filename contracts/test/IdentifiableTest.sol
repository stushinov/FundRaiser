pragma solidity ^0.4.24;
import "truffle/Assert.sol";
import "../contracts/Funding.sol";
contract IdentifiableTest {

    function testCreatingADonationsFundShouldReturnCorrectType() public {
        Identifiable i = new TimedFund(300);
        string memory expected =  "TimedFund";
        Assert.equal(i.getType(), expected, "Type mismatch!");
    }
}
