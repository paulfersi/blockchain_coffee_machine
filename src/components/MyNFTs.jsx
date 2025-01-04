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
        const address = await signer.address;

        if (!ethers.utils.isAddress(COFFEE_MACHINE_FACTORY_ADDRESS)) {
          throw new Error("Invalid contract address");
        }

        const factoryContract = new ethers.Contract(
          COFFEE_MACHINE_FACTORY_ADDRESS,
          COFFEE_MACHINE_FACTORY_ABI,
          signer
        );

        // tokenIDs owned by the owner
        const tokenIds = await factoryContract.addressToTokenID(address);

        setNFTs(tokenIds.filter((id) => id.toNumber() > 0)); // Ensure tokenIds are valid
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
          {nfts.map((id) => (
            <li key={id.toString()}>Token ID: {id.toString()}</li>
          ))}
        </ul>
      ) : (
        <p>You don't own any NFTs yet.</p>
      )}
    </div>
  );
};

export default MyNFTs;
