"use client";

import { useScaffoldWebSocketEvents } from "~~/hooks/scaffold-stark/useScaffoldWebSocketEvents";

export const TransferEvents = () => {
  const { events, isLoading, isConnected, error } = useScaffoldWebSocketEvents({
    contractName: "ERC20Contract",
    eventName: "Transfer",
    enabled: true,
  });

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format token amount (18 decimals)
  const formatAmount = (value: unknown) => {
    if (!value) return "0";
    try {
      const bigValue = BigInt(value.toString());
      const decimals = BigInt(10 ** 18);
      const wholePart = bigValue / decimals;
      const fractionalPart = bigValue % decimals;
      const fractionalStr = fractionalPart.toString().padStart(18, '0').slice(0, 4);
      return `${wholePart.toLocaleString()}.${fractionalStr}`;
    } catch {
      return "0";
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="card-title text-xl">Transfer Events</h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="badge badge-success gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Live
            </span>
          ) : (
            <span className="badge badge-warning">Connecting...</span>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <span className="loading loading-spinner loading-md"></span>
          <span className="ml-2">Connecting to events...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>Error: {error.message}</span>
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="text-center py-8 text-base-content/50">
          <p>No transfer events yet.</p>
          <p className="text-sm">Make a transfer to see events appear here in real-time!</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 10).map((event, index) => {
                const from = event.parsedArgs?.from || event.args?.[0];
                const to = event.parsedArgs?.to || event.args?.[1];
                const value = event.parsedArgs?.value || event.args?.[2];
                
                return (
                  <tr key={index} className="hover">
                    <td>
                      <span className="font-mono text-sm" title={from}>
                        {formatAddress(from?.toString() || "")}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-sm" title={to}>
                        {formatAddress(to?.toString() || "")}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold">
                        {formatAmount(value)} HYV
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {events.length > 10 && (
            <p className="text-center text-sm text-base-content/50 mt-2">
              Showing latest 10 of {events.length} events
            </p>
          )}
        </div>
      )}
    </div>
  );
};
