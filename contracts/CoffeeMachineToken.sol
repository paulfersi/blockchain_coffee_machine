// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoffeeMachineToken is ERC721URIStorage, Ownable {
    uint256 public nftPrice;
    uint256 private tokenCount;
    address public coffeeMachineFactoryOwner; 

    string public constant NFT_URI = "https://ipfs.io/ipfs/bafkreiguhoo2jy4c73kxdsd7d2ebcjjgw5boqsujddhoyje5oewe5oedum";

    constructor(address initialOwner, uint256 price) ERC721("Coffee Machine", "COFF") Ownable(initialOwner){
        coffeeMachineFactoryOwner = initialOwner;
        nftPrice = price;
    }

    function setNFTPrice(uint256 price) external onlyOwner {
        nftPrice = price;
    }

    function mintNFT(address to) external {
        require(msg.sender == owner(), "Only factory can mint");
        tokenCount++;
        _mint(to, tokenCount);
        _setTokenURI(tokenCount, NFT_URI);
    }


}
