"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useAccount } from "~~/hooks/useAccount";

export const Approve = () => {
  const { isConnected } = useAccount();
  const [spenderAddress, setSpenderAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { sendAsync, isPending } = useScaffoldWriteContract({
    contractName: "ERC20Contract",
    functionName: "approve",
    args: [spenderAddress, BigInt(Math.floor(parseFloat(amount || "0") * 10 ** 18))],
  });

  const handleApprove = async () => {
    if (!spenderAddress || !amount) {
      return;
    }

    try {
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 10 ** 18));
      await sendAsync({ args: [spenderAddress, amountInWei] });
      // Clear form on success
      setSpenderAddress("");
      setAmount("");
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-xl mb-2">Approve Spender</h2>
        <p className="text-gray-500">Connect your wallet to approve a spender</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl p-6 w-full max-w-md">
      <h2 className="card-title text-xl mb-4">Approve Spender</h2>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Spender Address</span>
        </label>
        <input
          type="text"
          placeholder="0x..."
          className="input input-bordered w-full"
          value={spenderAddress}
          onChange={(e) => setSpenderAddress(e.target.value)}
        />
      </div>

      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Amount to Approve</span>
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
        onClick={handleApprove}
        disabled={isPending || !spenderAddress || !amount}
      >
        {isPending ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Approving...
          </>
        ) : (
          "Approve"
        )}
      </button>
    </div>
  );
};
