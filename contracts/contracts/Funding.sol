pragma solidity ^0.4.24;
contract FundingFactory {


}

contract Fund {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function getBalance() constant public returns (uint256){
        return address(this).balance;
    }

    function getAddress() constant public returns (address) {
        return address(this);
    }

    function() public payable {}
}