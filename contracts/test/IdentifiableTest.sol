pragma solidity ^0.4.24;
import "truffle/Assert.sol";
import "../contracts/Funding.sol";
contract IdentifiableTest {

    uint256 constant ETH_MULTIPLIER = 10**18;

    function testCreatingADonationsFundShouldReturnCorrectType() public {
        Identifiable i = new TimedFund(msg.sender,"irrelevant", 300, 1 * ETH_MULTIPLIER);
        string memory expected =  "TimedFund";
        Assert.equal(i.getType(), expected, "Type mismatch!");
    }
}
