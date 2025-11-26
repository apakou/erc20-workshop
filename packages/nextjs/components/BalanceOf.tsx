"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useAccount } from "~~/hooks/useAccount";

export const BalanceOf = () => {
  const { address, isConnected } = useAccount();

  const { data: balance, isLoading, error } = useScaffoldReadContract({
    contractName: "ERC20Contract",
    functionName: "balanceOf",
    args: [address],
  });

  if (!isConnected) {
    return (
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-xl mb-2">Your Balance</h2>
        <p className="text-gray-500">Connect your wallet to view balance</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
        <span>Loading balance...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-error">
        Error loading balance: {error.message}
      </div>
    );
  }

  // Format the balance (assuming 18 decimals for ERC20)
  const formattedBalance = balance 
    ? (Number(balance) / 10 ** 18).toLocaleString() 
    : "0";

  return (
    <div className="card bg-base-200 shadow-xl p-6">
      <h2 className="card-title text-xl mb-2">Your Balance</h2>
      <p className="text-xl">{formattedBalance} <b>HYV</b></p>
    </div>
  );
};
