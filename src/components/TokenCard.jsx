import React, { useEffect, useState, useRef } from "react";
import { COFFEE_MACHINE_ABI } from "../config";
import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";

const TokenCard = ({ tokenId, machineAddress, provider }) => {
  const [isConnected, setIsConnected] = useState(false);
  const portRef = useRef(null);
  const [contract, setContract] = useState(null);
  const [machineBalance, setMachineBalance] = useState(null);

  const checkMachineBalance = async (machineAddress, provider) => {
    try {
      const balance = await provider.getBalance(machineAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      return null;
    }
  };

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

    const initializeMachineContract = async () => {
      try {
        const signer = provider.getSigner();
        const machineContractInstance = new ethers.Contract(
          machineAddress,
          COFFEE_MACHINE_ABI,
          signer
        );
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

    const filter = contract.filters.Deposit();
    contract.on(filter, (payee, value, time, balance) => {
      console.log("Deposit event:", { payee, value, time, balance });
      triggerRelay();
    });

    return () => {
      contract.off(filter);
      contract.removeAllListeners();
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
      await writer.write(new TextEncoder().encode("TRIGGER_RELAY\n"));
      writer.releaseLock();
      alert("Relay triggered!");
    } catch (error) {
      console.error("Error triggering relay:", error);
      alert("Failed to trigger relay.");
    }
  };

  const withdrawFunds = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    if (machineBalance === "0.0" || machineBalance === "0") {
      alert("Cannot withdraw: Contract balance is 0 ETH.");
      return;
    }

    try {
      const transaction = contract.withdraw();
      await transaction.wait();
    } catch (error) {
      console.error("Error withdrawing funds", error);
    }
  };

  return (
    <div className="card h-100 p-3">
      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">Token ID:</span>
        <span className="text-monospace">{tokenId}</span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">Machine Address:</span>
        <a
          href={`https://sepolia.etherscan.io/address/${machineAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none"
        >
          {machineAddress}
        </a>
      </div>

      {machineBalance !== null && (
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">Balance:</span>
          <span className="text-monospace">{parseFloat(machineBalance).toFixed(4)} ETH</span>
        </div>
      )}

      <div className="text-center mb-3">
        <QRCodeSVG
          value={machineAddress}
          size={128}
          level="H"
          marginSize={2}
          style={{ background: "white", padding: "0.5rem", borderRadius: "0.25rem" }}
        />
      </div>

      <div className="d-grid gap-2">
        <button
          className={`btn ${isConnected ? "btn-danger" : "btn-primary"}`}
          onClick={handleConnection}
        >
          {isConnected ? "Disconnect Machine" : "Connect Machine"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={withdrawFunds}
          disabled={machineBalance === "0.0" || machineBalance === "0"}
        >
          Withdraw Balance
        </button>
      </div>
    </div>
  );
};

export default TokenCard;