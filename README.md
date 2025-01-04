# Blockchain Coffee Machine

My first solidity project

THIS IS STILL WORK IN PROGRESS

## Features

#### NFT Ownership Representation
Each coffee machine is represented by an NFT. The NFT serves as proof of ownership and is transferrable.

#### Machine-Specific Smart Contract
Each machine has a unique smart contract linked to its NFT. This contract holds its balance and restricts withdrawals to the current NFT owner.

#### Payments and Withdrawals
Users pay into the machine's balance for coffee purchases. The machine's owner can withdraw accumulated funds.

#### Decentralized Ownership Transfer
When the NFT is transferred to a new owner, ownership of the associated machine and access to its balance automatically updates.

## Architecture

The smart contracts are:

- CoffeeMachineToken (NFT Contract/ERC721) : uses tokenId to link machine to uniq NFT
  
- CoffeeMachineFactory : to link each NFT to its machine contract.
  
- CoffeeMachine (Machine-Specific Contract) : stores the balance and allows only the owner to withdraw funds

## NFT info

I uploaded the NFT to IPFS. Here is the [json](https://ipfs.io/ipfs/bafkreiguhoo2jy4c73kxdsd7d2ebcjjgw5boqsujddhoyje5oewe5oedum).

The [image](utils/CoffeeMachine.jpg) of the token is AI-generated.

----

### Notes

A shared CoffeeMachineFactory contract could serve all users, while still letting them individually own their machines and NFTs. Here's how:

The factory has a mapping to keep track of which user owns which machines and tokens.
Any user can mint NFTs and deploy machines, but they only control the ones they own.

### Compilation and deployment of the Contracts

Notes
-> when you compile contracts-> you get the ABI
-> when you deploy contracts -> you get the address

I compiled and deployed them using Remix.
