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

    //debug
    console.log("FUNCTIONS", factoryContract.interface.forEachFunction((f)=>console.log(f)))

    try {
      setLoading(true);
      setError("");
      setTransactionHash("");

      const nftPrice = await factoryContract.currentNftPrice();


      console.log("NFT Price:", ethers.formatEther(nftPrice), "ETH");

      const tx = await factoryContract.createNFTAndMachine([], {
        value: nftPrice, 
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
    <div className="mint-nft">
      <h2>Mint NFT and Deploy Coffee Machine</h2>
      <button
        onClick={mintNFT}
        className="btn-mint"
        disabled={!provider || loading}
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>
      {transactionHash && (
        <p>
          Transaction Hash:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash}
          </a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MintNFT;
