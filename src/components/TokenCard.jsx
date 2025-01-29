import React, { useState } from "react";

const TokenCard = ({ tokenId, machineAddress }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState(null); //store serial port

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
      <br />
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