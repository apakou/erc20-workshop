"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useAccount } from "~~/hooks/useAccount";

export const TransferFrom = () => {
  const { isConnected } = useAccount();
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { sendAsync, isPending } = useScaffoldWriteContract({
    contractName: "ERC20Contract",
    functionName: "transferFrom",
    args: [fromAddress, toAddress, BigInt(Math.floor(parseFloat(amount || "0") * 10 ** 18))],
  });

  const handleTransferFrom = async () => {
    if (!fromAddress || !toAddress || !amount) {
      return;
    }

    try {
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 10 ** 18));
      await sendAsync({ args: [fromAddress, toAddress, amountInWei] });
      // Clear form on success
      setFromAddress("");
      setToAddress("");
      setAmount("");
    } catch (error) {
      console.error("TransferFrom failed:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-xl mb-2">Transfer From</h2>
        <p className="text-gray-500">Connect your wallet to transfer tokens</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl p-6 w-full max-w-md">
      <h2 className="card-title text-xl mb-4">Transfer From</h2>
      <p className="text-sm text-gray-500 mb-4">
        Transfer tokens from an account that has approved you as a spender
      </p>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">From Address</span>
        </label>
        <input
          type="text"
          placeholder="0x..."
          className="input input-bordered w-full"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
        />
      </div>

      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">To Address</span>
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
          <span className="label-text">Amount</span>
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
        className="btn btn-primary w-full"
        onClick={handleTransferFrom}
        disabled={isPending || !fromAddress || !toAddress || !amount}
      >
        {isPending ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Transferring...
          </>
        ) : (
          "Transfer From"
        )}
      </button>
    </div>
  );
};
