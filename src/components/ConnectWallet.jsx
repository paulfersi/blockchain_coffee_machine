import React, { useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setProvider }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        setError("");
        
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setAccount(account);
        
        // Fetch balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const ethBalance = ethers.utils.formatEther(balance);
        setBalance(ethBalance);
        
        // provider is set for access across components
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setError("MetaMask is not installed. Please install it to continue.");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title text-center">Wallet Connection</h2>
      
      {!account ? (
        <div className="text-center">
          <button 
            className="btn btn-outline-dark"
            onClick={connectWallet} 
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </button>
          
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      ) : (
        <div className="wallet-info">
          <div className="d-flex justify-content-between">
            <span className="text-muted">Account</span>
            <span className="text-monospace">{account}</span>
          </div>
          
          <div className="d-flex justify-content-between mt-2">
            <span className="text-muted">Balance</span>
            <span className="text-monospace">{parseFloat(balance).toFixed(4)} ETH</span>
          </div>
          
          <div className="text-center mt-3">
            <span className="badge bg-success">Connected</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;