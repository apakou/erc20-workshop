"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

export const TotalSupply = () => {
  const { data: totalSupply, isLoading, error } = useScaffoldReadContract({
    contractName: "ERC20Contract",
    functionName: "totalSupply",
    args: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
        <span>Loading total supply...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-error">
        Error loading total supply: {error.message}
      </div>
    );
  }

  // Format the total supply (assuming 18 decimals for ERC20)
  const formattedSupply = totalSupply 
    ? (Number(totalSupply) / 10 ** 18).toLocaleString() 
    : "0";

  return (
    <div className="card bg-base-200 shadow-xl p-6">
      <h2 className="card-title text-xl mb-2">Total Supply</h2>
      <p className="text-xl">{formattedSupply} <b>HYV</b></p>
    </div>
  );
};
