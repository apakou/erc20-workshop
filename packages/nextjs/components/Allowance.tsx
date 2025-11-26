"use client";

import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";

export const Allowance = () => {
  const { address, isConnected } = useAccount();
  const [spenderAddress, setSpenderAddress] = useState("");
  const [querySpender, setQuerySpender] = useState<string | undefined>(undefined);

  const { data: allowance, isLoading, error } = useScaffoldReadContract({
    contractName: "ERC20Contract",
    functionName: "allowance",
    args: [address, querySpender],
  });

  const handleCheckAllowance = () => {
    if (spenderAddress) {
      setQuerySpender(spenderAddress);
    }
  };

  if (!isConnected) {
    return (
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-xl mb-2">Check Allowance</h2>
        <p className="text-gray-500">Connect your wallet to check allowance</p>
      </div>
    );
  }

  // Format the allowance (assuming 18 decimals for ERC20)
  const formattedAllowance = allowance 
    ? (Number(allowance) / 10 ** 18).toLocaleString() 
    : "0";

  return (
    <div className="card bg-base-200 shadow-xl p-6 w-full max-w-md">
      <h2 className="card-title text-xl mb-4">Check Allowance</h2>
      
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

      <button
        className="btn btn-primary w-full mb-4"
        onClick={handleCheckAllowance}
        disabled={isLoading || !spenderAddress}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Checking...
          </>
        ) : (
          "Check Allowance"
        )}
      </button>

      {error && (
        <div className="text-error mb-2">
          Error: {error.message}
        </div>
      )}

      {spenderAddress && !error && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Allowance for spender:</p>
          <p className="text-2xl font-bold">{formattedAllowance}</p>
        </div>
      )}
    </div>
  );
};
