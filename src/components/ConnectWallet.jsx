import React, { useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setProvider }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
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

        // provider is set for access accros components
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
      } catch (err) {
        setError(`Error: ${err.message}`);
      }
    } else {
      setError("MetaMask is not installed. Please install it to continue.");
    }
  };

  return (
    <div className="container">
      <button onClick={connectWallet}>Connect MetaMask</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {account && <p>Connected Account: {account}</p>}
      {balance && <p>Balance: {balance} ETH</p>}
    </div>
  );
};

export default ConnectWallet;
