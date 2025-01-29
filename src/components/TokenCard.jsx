import React from "react";

const TokenCard = ({tokenId, machineAddress}) => {

    const connectMachine = async () => {
    try {
        const port = await navigator.serial.requestPort();

        await port.open({ baudRate: 9600 });

        alert("Connected to Arduino successfully!");
    } catch (error) {
        console.error("Error connecting to Arduino:", error);
        alert("Failed to connect to Arduino.");
    }
    };
    return (
        <li>
            <p>Token id: {tokenId}</p>
            <p>Machine associated: </p>
            <a href={`https://sepolia.etherscan.io/address/${machineAddress}`}
                target="_blank"
                rel="noopener noreferrer">
                {machineAddress}
            </a>
            <br></br>
            <button onClick={connectMachine}>Connect</button>
        </li>
    );
};

export default TokenCard;