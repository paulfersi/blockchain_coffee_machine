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
    <div className="card p-3">
      <h2 className="card-title text-center mb-3">Mint NFT and Deploy Coffee Machine</h2>

      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={mintNFT}
          disabled={!provider || loading}
        >
          {loading ? "Minting..." : "Mint NFT"}
        </button>

        {transactionHash && (
          <div className="mt-3">
            <span className="text-muted">Transaction:</span>
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2"
            >
              View on Etherscan
            </a>
          </div>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default MintNFT;