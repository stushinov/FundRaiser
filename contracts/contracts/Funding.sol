pragma solidity ^0.4.24;
contract FundingFactory {


}

contract Fund {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
}