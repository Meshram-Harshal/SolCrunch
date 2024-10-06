import { openExplorerUrl } from "../utils/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader } from "@/components/ui/loader";
import moment from "moment";
import { useTransactions } from "@/hooks/useTransactions";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const Transactions = () => {
  const { publicKey } = useWallet();
  const [search, setSearch] = useState("");
  const { transactions, isLoading, error, refetch } = useTransactions(publicKey);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  useEffect(() => {
    if (search) {
      const filtered = transactions?.filter((txn) =>
        txn.signature.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [search, transactions]);

  const transactionsToRender = search ? filteredTransactions : transactions;

  if (!publicKey) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-300 font-thin">
          Connect your wallet to view transactions
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center h-screen">
        <Loader className="w-5 h-5 text-gray-300" />
        <p className="text-gray-300 font-thin">Fetching transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 flex justify-center items-center h-screen">
        Error: {error.message}
      </div>
    );
  }

  if (!transactions?.length) return null;

  return (
    <div style={{ background: 'rgb(15, 3, 63)' }} className="flex justify-center items-center h-screen">
      <div style={{ marginTop: '5rem' }} className="relative bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-lg border border-white/30 w-full max-w-5xl h-[80%] flex flex-col">
        <div className="flex justify-between items-center pb-5">
          <h1 className="text-4xl font-semibold text-gray-100">Transactions</h1>
          {/* <button
            disabled={isLoading}
            onClick={() => {
              refetch(); // This will refetch the transactions
            }}
            className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            <RotateCcw strokeWidth={1.25} size={20} />
          </button> */}
        </div>
        <div className="pb-2">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search for a signature"
            className="w-full p-2 rounded-md bg-white/30 focus:outline-black text-gray-800 font-light"
          />
        </div>
        <div className="overflow-auto flex-grow">
          <div className="grid grid-cols-[120px_1fr] gap-4 h-8 px-2 text-gray-800 font-semibold items-center">
            <h3 className="text-gray-100">Time</h3>
            <h3 className="text-gray-100">Signature</h3>
          </div>
          {transactionsToRender.map((txn) => (
            <div
              onClick={() => openExplorerUrl(txn.signature, true)}
              className="grid grid-cols-[120px_1fr] gap-4 cursor-pointer hover:bg-white/10 transition-colors h-12 px-2 text-gray-500 font-light rounded"
              key={txn.signature}
            >
              <div className="text-sm flex items-center hover:underline">
                <p className="text-gray-200">{moment.unix(txn.blockTime).fromNow()}</p>
              </div>
              <div className="flex items-center justify-start">
                <p className="text-left text-gray-200">{txn.signature}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
