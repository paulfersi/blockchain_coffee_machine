# Blockchain-connected Coffee Machine

## Overview

<p align="center">
  <img src="/utils/physical_device.jpg" width="500">
</p>

This is an experimental Web3 project that merges smart contracts with physical hardware. It allows users to activate a real coffee machine by sending ETH to its associated smart contract. Each machine is linked to its own unique NFT, offering a fun and practical example of how decentralized ownership and payments can connect with the real world.

## Tech stack

- Solidity, Ethereum blockchain
- React
- Arduino 


## Functionalities

### Workflow

The system is composed of three main parts:

- Smart contracts on Ethereum
- A React dashboard
- A physical coffee machine controlled via Arduino

When a user sends ETH to a coffee machine's smart contract, the payment is detected by the frontend, which then sends a signal to the Arduino to brew coffee.

### Tokenized ownership

Each coffee machine is associated with an NFT (ERC-721), minted through the CoffeeMachineFactory contract. Ownership of the NFT grants control over the machine and allows the owner to withdraw the ETH it collects. 

## Smart contracts architecture

- CoffeeMachineFactory.sol: Handles NFT minting and machine deployment.
- CoffeeMachineToken.sol: ERC-721 NFT implementation with metadata hosted on IPFS.
- CoffeeMachine.sol: A contract deployed per machine acting as a dedicated wallet.

When an NFT is minted, the factory deploys a new CoffeeMachine contract, mapping the token to a unique wallet address. This address receives ETH payments and emits an event when deposits occur, which the frontend listens to in real-time.

## React dashboard

<p align="center">
  <img src="/utils/dashboard_react.png" width="500">
</p>
The frontend provides an interface where users can monitor machines, send payments, and—if they own the NFT—withdraw collected funds. It actively listens to the blockchain for events like payments or ownership transfers and updates the UI accordingly.

## Physical device integration

Once a deposit event is detected, the React app sends a command to an Arduino board connected to the coffee machine. The board controls a relay that powers the machine, simulating a button press to brew a cup of coffee.

## Future improvements

Currently, the integration of a paper display is not included in the main branch due to issues likely caused by the serial connection. The dashboard is designed to send two messages over serial: one to trigger the relay and another to send the machine address, which should be displayed as a QR code on the screen. Switching to BLE or Wi-Fi would likely offer a more reliable and efficient communication method than serial.

## NFT info

I uploaded the NFT to IPFS. Here is the [json](https://gateway.pinata.cloud/ipfs/bafkreiguhoo2jy4c73kxdsd7d2ebcjjgw5boqsujddhoyje5oewe5oedum).

The [image](utils/CoffeeMachine.jpg) of the token is AI-generated.