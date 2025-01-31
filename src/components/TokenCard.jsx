import React, { useEffect, useState, useRef } from "react";
import { COFFEE_MACHINE_ABI } from "../config";
import { ethers } from "ethers";
import { QRCodeSVG } from 'qrcode.react';

const TokenCard = ({ tokenId, machineAddress, provider }) => {
  const [isConnected, setIsConnected] = useState(false);
  const portRef = useRef(null); 
  const [contract, setContract] = useState(null); //contract instance
  const [machineBalance, setMachineBalance] = useState(null);

  const checkMachineBalance = async(machineAddress,provider) => {
    try{
      const balance = await provider.getBalance(machineAddress);
      return ethers.utils.formatEther(balance); //wei to ether
    }catch(error){
      console.error("Error fetching contract balance:", error);
      return null;
    }
  }

  const updateMachineBalance = async () => {
    const balance = await checkMachineBalance(machineAddress, provider);
    setMachineBalance(balance);
  };

  useEffect(() => {
    if (!provider || !machineAddress) return;

    updateMachineBalance();
    const balancePollingInterval = setInterval(updateMachineBalance, 5000);

    return () => {
      clearInterval(balancePollingInterval);
    };
  }, [provider, machineAddress]);

  useEffect(() => {
    if (!provider || !machineAddress) return;

    //initialize the machine contract related to this specific TokenCard
    const initializeMachineContract = async () => {
      try {
        const signer = provider.getSigner();

        const machineContractInstance = new ethers.Contract(machineAddress, COFFEE_MACHINE_ABI, signer);
        setContract(machineContractInstance);

      } catch (error) {
        console.error("Error initializing machine contract for", { machineAddress });
      }
    };

    initializeMachineContract();
  }, [provider, machineAddress]);

  useEffect(() => {
    if (!contract) return;

    const handleWithdrawEvent = (time, amount) => {
      const formattedAmount = ethers.utils.formatEther(amount);
      alert(`Successfully withdrew ${formattedAmount} ETH!`);
    };

    const filter = contract.filters.Withdraw();
    contract.on(filter, handleWithdrawEvent);

    return () => {
      contract.off(filter, handleWithdrawEvent);
    };
  }, [contract]);

  useEffect(() => {
    if (!contract) return;

      contract.on(filter, (payee, value, time, balance) => {
      console.log("Deposit event:", { payee, value, time, balance });
      triggerRelay();
    });

    return () => {
      contract.off(filter);
    };
  }, [contract]); 

  const handleConnection = async () => {
    if (isConnected) {
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      setIsConnected(false);
      alert("Arduino disconnected.");
    } else {
      //connect the Arduino
      try {
        const newPort = await navigator.serial.requestPort();
        await newPort.open({ baudRate: 9600 });
        portRef.current = newPort;
        setIsConnected(true);
        alert("Arduino connected successfully!");
      } catch (error) {
        console.error("Error connecting to Arduino:", error);
        alert("Failed to connect to Arduino.");
      }
    }
  };

  const triggerRelay = async () => {
    if (!portRef.current) {
      alert("Arduino is not connected.");
      return;
    }

    try {
      const writer = portRef.current.writable.getWriter();
      await writer.write(new TextEncoder().encode("TRIGGER_RELAY\n")); //send custom command to arduino
      writer.releaseLock();
      alert("Relay triggered!");
    } catch (error) {
      console.error("Error triggering relay:", error);
      alert("Failed to trigger relay.");
    }
  };

  const withdrawFunds = async () =>{
    if(!contract){
      console.error("Contract not initialized");
      return;
    }
    if (machineBalance === "0.0" || machineBalance === "0") {
      alert("Cannot withdraw: Contract balance is 0 ETH.");
      return;
    }

    try{
      const transaction = contract.withdraw();
      await transaction.wait();
      //the event listener will determine the success 
    }catch(error){
      console.error("Error withdrawing funds",error);
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
      <br />
      {machineBalance !== null && (
        <p>Balance: {machineBalance} ETH</p>
      )}
      <div style={{ margin: "10px 0" }}>
        <QRCodeSVG
          value={machineAddress}
          size={128}
          level="H" //error correction level
          marginSize={2}
        />
      </div>
      <button onClick={handleConnection}>
        {isConnected ? "Disconnect" : "Connect"}
      </button>
      <button onClick={withdrawFunds} style={{ marginLeft: "10px" }}>Withdraw balance</button>
    </li>
  );
};

export default TokenCard;