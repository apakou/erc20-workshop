"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useAccount } from "~~/hooks/useAccount";

export const Burn = () => {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  const { sendAsync, isPending } = useScaffoldWriteContract({
    contractName: "ERC20Contract",
    functionName: "burn",
    args: [BigInt(Math.floor(parseFloat(amount || "0") * 10 ** 18))],
  });

  const handleBurn = async () => {
    if (!amount) {
      return;
    }

    try {
      // Convert amount to wei (18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 10 ** 18));
      await sendAsync({ args: [amountInWei] });
      // Clear form on success
      setAmount("");
    } catch (error) {
      console.error("Burn failed:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-xl mb-2">Burn Tokens</h2>
        <p className="text-gray-500">Connect your wallet to burn tokens</p>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl p-6 w-full max-w-md">
      <h2 className="card-title text-xl mb-4">Burn Tokens</h2>
      <p className="text-sm text-gray-500 mb-4">
        Permanently destroy tokens from your balance
      </p>
      
      <div className="form-control w-full mb-4">
        <label className="label">
          <span className="label-text">Amount to Burn</span>
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
        className="btn btn-error w-full"
        onClick={handleBurn}
        disabled={isPending || !amount}
      >
        {isPending ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Burning...
          </>
        ) : (
          "Burn"
        )}
      </button>
    </div>
  );
};
