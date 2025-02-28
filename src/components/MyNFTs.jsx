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

        // allows to make multiple async requests
        const nftData = await Promise.all(
          tokenIds.map(async (id) => {
            const machineAddress = await factoryContract.getMachineAddress(id);
            return {
              tokenId: id.toString(),
              machineAddress,
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
    <div className="card p-3">
      <h2 className="card-title text-center mb-4">My NFTs</h2>

      {loading && (
        <div className="text-center">
          <p>Loading your NFTs...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && nfts.length === 0 && (
        <div className="text-center">
          <p>You don't own any Coffee Machine NFTs yet.</p>
        </div>
      )}

      {nfts.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {nfts.map(({ tokenId, machineAddress }) => (
            <div key={tokenId} className="col">
              <TokenCard
                tokenId={tokenId}
                machineAddress={machineAddress}
                provider={provider}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNFTs;