pragma solidity ^0.4.24;
contract FundingFactory {


}

interface Identifiable {
    function getType() public view returns (string);
}

contract Fund {

    using SafeMath for uint256;

    address public owner;

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
    mapping(address => uint256) private donations;

    constructor(uint256 _expires, uint256 _target) public {
        expires = now.add(_expires);
        target = _target;
    }

    function withdrawal(uint256 _amount) public payable {
        owner.transfer(_amount);
        emit Donation(msg.sender, _amount);
    }

    function getType() public view returns (string) {
        return "TimedFund";
    }

    function getDonations(address _ofAddress) public view returns (uint256) {
        return donations[_ofAddress];
    }

    function() public payable nonExpired {
        donations[msg.sender] = donations[msg.sender].add(msg.value);
        emit Donation(msg.sender, msg.value);
    }
}

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
