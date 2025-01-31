import React, { useEffect, useState } from "react";
import { COFFEE_MACHINE_ABI } from "../config";
import { ethers } from "ethers";
import {QRCodeSVG} from 'qrcode.react';

const TokenCard = ({ tokenId, machineAddress, provider }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState(null); //serial port
  const [contract, setContract] = useState(null); //contract instance

  useEffect(() => {
    if (!provider || !machineAddress) return;

    //initialize the machine contract related to this specific TokenCard
    const initializeMachineContract = async () => {
      try{
        const signer = provider.getSigner();

        const machineContractInstance = new ethers.Contract(machineAddress,COFFEE_MACHINE_ABI,signer);
        setContract(machineContractInstance);
      }catch(error){
        console.error("Error initializing machine contract for",{machineAddress});
      }
    };

    initializeMachineContract();
  },[provider,machineAddress]);

  useEffect(() => {
    //listen to Deposit event on this machine
    if (!contract) return;

    const filter = contract.filters.Deposit();
    contract.on(filter,(payee,value,time,balance) => {
      console.log("Deposit event:", {payee,value,time,balance});
      triggerRelay();
    });

    //cleanup filter once the component unmounts
    return () =>{
      contract.off(filter);
    };
  }, [contract]);

  const handleConnection = async () => {
    if (isConnected) {
      if (port) {
        await port.close();
        setPort(null);
      }
      setIsConnected(false);
      alert("Arduino disconnected.");
    } else {
      //connect the Arduino
      try {
        const newPort = await navigator.serial.requestPort();
        await newPort.open({ baudRate: 9600 });
        setPort(newPort);
        setIsConnected(true);
        alert("Arduino connected successfully!");
      } catch (error) {
        console.error("Error connecting to Arduino:", error);
        alert("Failed to connect to Arduino.");
      }
    }
  };

  const triggerRelay = async () => {
    if (!port) {
      alert("Arduino is not connected.");
      return;
    }

    try {
      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode("TRIGGER_RELAY\n")); //send command to arduino
      writer.releaseLock();
      alert("Relay triggered!");
    } catch (error) {
      console.error("Error triggering relay:", error);
      alert("Failed to trigger relay.");
    }
  };

  return (
    <li>
      <p>Token id: {tokenId}</p>
      <p>Machine associated: </p>
      <a
        href={`https://sepolia.etherscan.io/address/${machineAddress}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {machineAddress}
      </a>
      <br/>
      <div style={{ margin: "10px 0" }}>
        <QRCodeSVG
          value={machineAddress}
          size={128}
          level="H" //error correction level
          includeMargin={true}
        />
      </div>
      <button onClick={handleConnection}>
        {isConnected ? "Disconnect" : "Connect"}
      </button>
      {isConnected && (
        <button onClick={triggerRelay} style={{ marginLeft: "10px" }}>
          Make Coffee
        </button>
      )}
    </li>
  );
};

export default TokenCard;