import { TotalSupply } from "~~/components/TotalSupply";
import { BalanceOf } from "~~/components/BalanceOf";
import { Transfer } from "~~/components/Transfer";
import { Approve } from "~~/components/Approve";
import { Allowance } from "~~/components/Allowance";
import { TransferFrom } from "~~/components/TransferFrom";
import { Burn } from "~~/components/Burn";
import { Mint } from "~~/components/Mint";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Hyver Token Token Dashboard
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Manage your tokens with ease. Transfer, approve, mint, and burn tokens all in one place.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <TotalSupply />
          <BalanceOf />
        </div>

        {/* Actions Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Token Actions</h2>
          
          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Transfer />
            <Approve />
            <Allowance />
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TransferFrom />
            <Mint />
            <Burn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
