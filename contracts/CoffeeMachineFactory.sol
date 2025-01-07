// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./CoffeeMachineToken.sol";
import "./CoffeeMachine.sol";

contract CoffeeMachineFactory {
    CoffeeMachineToken public tokenContract;
    address public factoryOwner;
    uint256 public currentNftPrice;
    uint256 public tokenCount;

    mapping(uint256 => address) public tokenIdToOwner; // Maps token ID to its owner
    mapping(address => uint256[]) public ownerToTokenIds; // Maps owner to their token IDs
    mapping(uint256 => CoffeeMachine) public tokenIdToMachine; // Maps token ID to its machine

    event NFTMinted(address indexed owner, uint256 tokenId);
    event MachineDeployed(address indexed owner, uint256 tokenId, address machineAddress);

    modifier onlyTokenOwner(uint256 tokenId) {
        require(tokenIdToOwner[tokenId] == msg.sender, "Not the owner of this token");
        _;
    }

    constructor() {
        factoryOwner = msg.sender;
        currentNftPrice = 0.00001 ether;
        tokenContract = new CoffeeMachineToken(address(this), currentNftPrice);
        tokenCount = 0;
    }

    function setNFTPrice(uint256 price) public {
        require(msg.sender == factoryOwner, "Only factory owner can set the NFT price");
        tokenContract.setNFTPrice(price);
        currentNftPrice = price;
    }

    function mintNFTAndDeployMachine(uint256 payment) public payable {
        require(payment >= currentNftPrice, "Insufficient funds to mint NFT");

        // mint the NFT
        tokenCount++;
        tokenContract.mintNFT(msg.sender);
        tokenIdToOwner[tokenCount] = msg.sender;
        ownerToTokenIds[msg.sender].push(tokenCount);

        emit NFTMinted(msg.sender, tokenCount);

        // deploy the CoffeeMachine
        CoffeeMachine machine = new CoffeeMachine(tokenContract, tokenCount);
        tokenIdToMachine[tokenCount] = machine;

        emit MachineDeployed(msg.sender, tokenCount, address(machine));
    }

    function getOwnedTokenIds(address owner) public view returns (uint256[] memory) {
        return ownerToTokenIds[owner];
    }

    function getMachineAddress(uint256 tokenId) public view returns (address) {
        return address(tokenIdToMachine[tokenId]);
    }

    function getMachineBalance(uint256 tokenId) public view onlyTokenOwner(tokenId) returns (uint256) {
        return tokenIdToMachine[tokenId].getBalance();
    }

    function withdrawFromMachine(uint256 tokenId) public onlyTokenOwner(tokenId) {
        tokenIdToMachine[tokenId].withdraw();
    }
}
