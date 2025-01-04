//SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "./CoffeeMachineToken.sol";

contract CoffeeMachine {
    CoffeeMachineToken public tokenContract;
    uint256 public tokenId;

    event Deposit(address indexed payee, uint256 value, uint256 time, uint256 balance);
    event Withdraw(uint256 time, uint256 amount);

    constructor(CoffeeMachineToken _tokenContract, uint256 _tokenId) {
        tokenContract = CoffeeMachineToken(_tokenContract);
        tokenId = _tokenId;
    }

    modifier onlyOwner() {
        require(tokenContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        _;
    }

    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Withdrawal failed");
        emit Withdraw(block.timestamp, balance);
    }

    function getAddress() public view returns (address){
        return address(this);
    } 

    receive() external payable {
        emit Deposit(msg.sender, msg.value, block.timestamp, address(this).balance);
    }
}

