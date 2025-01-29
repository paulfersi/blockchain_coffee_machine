// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CoffeeMachineFactory.sol";

contract CoffeeMachineToken is ERC721URIStorage, Ownable {
    uint256 public nftPrice;
    uint256 private tokenCount;
    CoffeeMachineFactory public coffeeMachineFactory; 

    string public constant NFT_URI = "ipfs://bafkreiguhoo2jy4c73kxdsd7d2ebcjjgw5boqsujddhoyje5oewe5oedum";

    constructor(address initialOwner, uint256 price) ERC721("Coffee Machine", "COFF") Ownable(initialOwner) {
        coffeeMachineFactory = CoffeeMachineFactory(initialOwner); 
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

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            coffeeMachineFactory.updateTokenOwnership(from, to, tokenId);
        }
        return super._update(to, tokenId, auth); 
    }
}