pragma solidity ^0.4.24;
contract FundingFactory {

    event ContractCreated(address contractAddress, address _by);

    function createTimedFund(uint256 expirationTime, uint256 goal) public returns(address){
        Identifiable i = new TimedFund(msg.sender, expirationTime, goal);
        emit ContractCreated(i, msg.sender);
        return i;
    }
}

interface Identifiable {
    function getType() public view returns (string);
}

contract Fund {

    using SafeMath for uint256;

    address public owner;

    event Donation(address sender, uint256 amount);

    constructor(address _owner) public {
        owner = _owner;
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

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier goalReached {
        require(raised >= target);
        _;
    }

    modifier ifFailed {
        require(raised < target && now > expires);
        _;
    }

    uint256 public expires;
    uint256 public target;
    uint256 public raised;

    mapping(address => uint256) private donations;

    constructor(address _owner, uint256 _expires, uint256 _target) Fund(_owner) public {
        expires = now.add(_expires);
        target = _target;
        raised = 0;
    }

    function refund() public payable ifFailed {
        msg.sender.transfer(donations[msg.sender]);
        donations[msg.sender] = donations[msg.sender].sub(donations[msg.sender]);
    }

    function withdrawal(uint256 _amount) public payable onlyOwner goalReached {
        owner.transfer(_amount);
    }

    function getType() public view returns (string) {
        return "TimedFund";
    }

    function getDonations(address _ofAddress) public view returns (uint256) {
        return donations[_ofAddress];
    }

    function() public payable nonExpired {
        donations[msg.sender] = donations[msg.sender].add(msg.value);
        raised = raised.add(msg.value);
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
