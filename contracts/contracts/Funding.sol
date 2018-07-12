pragma solidity ^0.4.24;
contract FundingFactory {


}

interface Identifiable {
    function getType() public view returns (string);
}

contract Fund {

    address public owner;
    string public kuromi = "kuromi";

    event Donation(address sender, uint256 amount);

    constructor() public {
        owner = msg.sender;
    }

    function getBalance() constant public returns (uint256){
        return address(this).balance;
    }

    function getAddress() constant public returns (address) {
        return address(this);
    }

    function() public payable {
        emit Donation(msg.sender, msg.value);
    }
}

contract TimedFund is Fund, Identifiable {

    modifier nonExpired {
        require(now <= expires);
        _;
    }

    uint256 public expires;
    uint256 public target;

    constructor(uint256 _expires, uint256 _target) public {
        expires = now + _expires;
        target = _target;
    }

    function getType() public view returns (string) {
        return "TimedFund";
    }

    function() public payable nonExpired {
        emit Donation(msg.sender, msg.value);
    }
}