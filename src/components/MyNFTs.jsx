import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { COFFEE_MACHINE_FACTORY_ADDRESS, COFFEE_MACHINE_FACTORY_ABI } from "../config";
import TokenCard from "./TokenCard";

const MyNFTs = ({ provider }) => {
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider) return;
      
      setLoading(true);
      setError("");
      
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        if (!ethers.utils.isAddress(COFFEE_MACHINE_FACTORY_ADDRESS)) {
          throw new Error("Invalid contract address");
        }
        
        const factoryContract = new ethers.Contract(
          COFFEE_MACHINE_FACTORY_ADDRESS,
          COFFEE_MACHINE_FACTORY_ABI,
          signer
        );
        
        // tokenIDs owned by the owner
        const tokenIds = await factoryContract.getOwnedTokenIds(address);
        
        //allows to make multiple async request
        const nftData = await Promise.all(
          tokenIds.map(async (id) => {
            const machineAddress = await factoryContract.getMachineAddress(id);
            return {
              tokenId: id.toString(),
              machineAddress
            };
          })
        );
        
        setNFTs(nftData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch NFTs.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNFTs();
  }, [provider]);
  
  return (
    <div className="card">
      <h2 className="card-title">My NFTs</h2>
      
      {loading && (
        <div className="center-content">
          <p>Loading your NFTs...</p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && nfts.length === 0 && (
        <div className="center-content">
          <p>You don't own any Coffee Machine NFTs yet.</p>
        </div>
      )}
      
      {nfts.length > 0 && (
        <ul className="nft-list">
          {nfts.map(({ tokenId, machineAddress }) => (
            <TokenCard 
              key={tokenId} 
              tokenId={tokenId} 
              machineAddress={machineAddress} 
              provider={provider} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyNFTs;