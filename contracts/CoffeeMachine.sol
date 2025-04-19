//SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "./CoffeeMachineToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CoffeeMachine {
    CoffeeMachineToken public tokenContract;
    AggregatorV3Interface internal priceFeed;
    uint256 public tokenId;
    uint256 public minUsd = 100 * 10**8; //$1.00 in 8-decimal (to match the chainlink feed)

    event Deposit(address indexed payee, uint256 value, uint256 time, uint256 balance);
    event Withdraw(uint256 time, uint256 amount);

    constructor(CoffeeMachineToken _tokenContract, uint256 _tokenId) {
        tokenContract = CoffeeMachineToken(_tokenContract);
        tokenId = _tokenId;
        priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306); //Sepolia ETH/USD
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

    function getUsdValue(uint256 ethAmount) public view returns (uint256) {
        (, int price,,,) = priceFeed.latestRoundData();
        //price is ETH/USD with 8 decimals, ethAmount is in wei (1e18)
        return (uint256(price) * ethAmount) / 1e18;
    }

    receive() external payable {
        require(getUsdValue(msg.value) >= minUsd, "Send at least $1 worth of ETH");
        emit Deposit(msg.sender, msg.value, block.timestamp, address(this).balance);
    }
}

