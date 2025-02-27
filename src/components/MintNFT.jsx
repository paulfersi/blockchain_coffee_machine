import React, { useState } from "react";
import { ethers } from "ethers";
import { COFFEE_MACHINE_FACTORY_ADDRESS, COFFEE_MACHINE_FACTORY_ABI } from "../config";

const MintNFT = ({ provider }) => {
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");
  
  const mintNFT = async () => {
    if (!provider) {
      alert("Please connect your wallet first.");
      return;
    }
    
    const signer = provider.getSigner();
    const factoryContract = new ethers.Contract(
      COFFEE_MACHINE_FACTORY_ADDRESS,
      COFFEE_MACHINE_FACTORY_ABI,
      signer
    );
    
    try {
      setLoading(true);
      setError("");
      setTransactionHash("");
      
      const nftPrice = await factoryContract.currentNftPrice();
      console.log("NFT Price:", ethers.utils.formatEther(nftPrice), "ETH");
      
      const formattedPrice = ethers.utils.parseEther(ethers.utils.formatEther(nftPrice));
      const tx = await factoryContract.mintNFTAndDeployMachine(formattedPrice, {
        value: formattedPrice,
      });
      
      console.log("Transaction sent:", tx.hash);
      setTransactionHash(tx.hash);
      await tx.wait();
      console.log("Transaction confirmed!");
    } catch (err) {
      console.error(err);
      setError("Minting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card">
      <h2 className="card-title">Mint NFT and Deploy Coffee Machine</h2>
      
      <div className="center-content">
        <button
          onClick={mintNFT}
          disabled={!provider || loading}
        >
          {loading ? "Minting..." : "Mint NFT"}
        </button>
        
        {transactionHash && (
          <div className="info-row" style={{ marginTop: "1rem" }}>
            <span className="info-label">Transaction:</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary-color)" }}
            >
              View on Etherscan
            </a>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default MintNFT;