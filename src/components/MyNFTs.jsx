import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { COFFEE_MACHINE_FACTORY_ADDRESS, COFFEE_MACHINE_FACTORY_ABI } from "../config";

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

        setNFTs(nftData); //each nft is stored with tokenID and machineAddress
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
    <div>
      <h3>My NFTs</h3>
      {loading && <p>Loading NFTs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {nfts.length > 0 ? (
        <ul>
          {nfts.map(({ tokenId, machineAddress }) => (
            <li key={tokenId}>
              <p>Token ID: {tokenId}</p>
              <a
                href={`https://sepolia.etherscan.io/address/${machineAddress}`}
                target="_blank"
              >${machineAddress}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't own any NFTs yet.</p>
      )}
    </div>
  );
};

export default MyNFTs;
