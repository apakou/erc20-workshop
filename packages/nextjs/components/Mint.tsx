"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useAccount } from "~~/hooks/useAccount";

export const Mint = () => {
  const { isConnected } = useAccount();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { sendAsync, isPending } = useScaffoldWriteContract({
    contractName: "ERC20Contract",
    functionName: "mint",
    args: [toAddress, BigInt(Math.floor(parseFloat(amount || "0") * 10 ** 18))],
  });

  const handleMint = async () => {
    if (!toAddress || !amount) {
      return;
    }

    try {
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 10 ** 18));
      await sendAsync({ args: [toAddress, amountInWei] });
      // Clear form on success
      setToAddress("");
      setAmount("");
    } catch (error) {
      console.error("Mint failed:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-xl mb-2">Mint Tokens</h2>
        <p className="text-gray-500">Connect your wallet to mint tokens</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl p-6 w-full max-w-md">
      <h2 className="card-title text-xl mb-4">Mint Tokens</h2>
      <p className="text-sm text-gray-500 mb-4">
        Create new tokens and send them to an address
      </p>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Recipient Address</span>
        </label>
        <input
          type="text"
          placeholder="0x..."
          className="input input-bordered w-full"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
      </div>

      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Amount to Mint</span>
        </label>
        <input
          type="number"
          placeholder="0.0"
          className="input input-bordered w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
        />
      </div>

      <button
        className="btn btn-success w-full"
        onClick={handleMint}
        disabled={isPending || !toAddress || !amount}
      >
        {isPending ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Minting...
          </>
        ) : (
          "Mint"
        )}
      </button>
    </div>
  );
};
