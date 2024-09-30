import React, { useState, useCallback, ChangeEvent } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { CompressedTokenInfo } from '@/context/zkCompressionContext';
import { DecompressTokenModal } from '@/components/modals/DecompressTokenModal';
import { ReclaimModal } from '@/components/modals/ReclaimModal';
import { TokenAccount } from '@/utils/solana';
import { useCompressedTokenBalance } from '@/hooks/useCompressedTokenBalance';
import { useSplTokenAccounts } from '@/hooks/useSplTokenAccounts';
import { motion } from 'framer-motion';

// Define a union type for tokens
type Token = CompressedTokenInfo | TokenAccount;

// Props for TokenBox component
interface TokenBoxProps {
  tokens: Token[];
  onTokenSelect: (token: Token) => void;
  selectedToken: Token | null;
}

// TokenBox Component
const TokenBox: React.FC<TokenBoxProps> = ({ tokens, onTokenSelect, selectedToken }) => (
  <motion.div
    className="bg-gray-700 rounded-lg p-4 w-full text-white"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-lg font-semibold mb-4">Select Token</h3>
    <div className="overflow-y-auto h-56"> {/* Fixed height to display 4 tokens */}
      {tokens.map((token) => (
        <div key={token.mint} className="flex justify-between items-center bg-gray-600 rounded-lg p-3 mb-2 w-full">
          <div className="flex items-center overflow-hidden">
            <input
              type="checkbox"
              checked={selectedToken?.mint === token.mint}
              onChange={() => onTokenSelect(token)}
              className="mr-2"
              aria-label={`Select token ${token.mint}`}
            />
            <p className="mr-2 truncate">{token.mint}</p>
            <span className="text-gray-400">
              {'balance' in token ? token.balance : token.amount?.toString() || '0'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Props for ToggleBar component
interface ToggleBarProps {
  currentMode: 'Compression' | 'Decompression';
  onToggle: (mode: 'Compression' | 'Decompression') => void;
}

// ToggleBar Component
const ToggleBar: React.FC<ToggleBarProps> = ({ currentMode, onToggle }) => (
  <motion.div
    className="flex items-center justify-center space-x-1 bg-gray-800 p-1 rounded-full w-full max-w-xs mx-auto mt-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <button
      aria-pressed={currentMode === 'Compression'}
      className={`px-7 py-3 font-playpen rounded-full transition-colors duration-300 ${
        currentMode === 'Compression' ? 'bg-purple-400 text-white' : 'bg-black text-gray-400'
      }`}
      onClick={() => onToggle('Compression')}
    >
      Compression
    </button>
    <button
      aria-pressed={currentMode === 'Decompression'}
      className={`px-7 py-3 font-playpen rounded-full transition-colors duration-300 ${
        currentMode === 'Decompression' ? 'bg-purple-400 text-white' : 'bg-black text-gray-400'
      }`}
      onClick={() => onToggle('Decompression')}
    >
      Decompression
    </button>
  </motion.div>
);

// Main CompressedTokens Component
const CompressedTokens: React.FC = () => {
  const { publicKey: connectedWallet } = useWallet();

  // Fetch compressed tokens
  const {
    compressedTokens: allCompressedTokens,
    isFetching: isFetchingCompressedTokens,
    error: errorFetchingCompressedTokens,
  } = useCompressedTokenBalance();

  // Fetch SPL token accounts
  const {
    splTokenAccounts,
    isFetching: isFetchingSplTokenAccounts,
    error: errorFetchingSplTokenAccounts,
  } = useSplTokenAccounts();

  // State variables
  const [isDecompressingTokens, setIsDecompressingTokens] = useState(false);
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [search, setSearch] = useState<string>('');
  const [mode, setMode] = useState<'Compression' | 'Decompression'>('Compression');

  // Handler to toggle between Compression and Decompression modes
  const handleToggleMode = useCallback(
    (newMode: 'Compression' | 'Decompression') => {
      setMode(newMode);
      setSelectedToken(null); // Reset selected token when mode changes
      setSearch(''); // Reset search when mode changes
    },
    []
  );

  // Handler for search input
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  // Handler for token selection
  const handleTokenSelect = useCallback((token: Token) => {
    setSelectedToken((prev) => (prev?.mint === token.mint ? null : token));
  }, []);

  // Filter tokens based on mode and search input
  const filteredTokens =
    mode === 'Compression'
      ? splTokenAccounts?.filter((token) =>
          token.mint.toLowerCase().includes(search.toLowerCase())
        )
      : allCompressedTokens?.filter((token) =>
          token.mint.toLowerCase().includes(search.toLowerCase())
        );

  const tokensToRender =
    filteredTokens || (mode === 'Compression' ? splTokenAccounts : allCompressedTokens);

  // Handlers for compressing and decompressing tokens
  const handleCompress = useCallback(() => {
    if (selectedToken) {
      console.log('Compressing token:', selectedToken);
      // Implement your compression logic here
      setIsReclaiming(true);
    }
  }, [selectedToken]);

  const handleDecompress = useCallback(() => {
    if (selectedToken) {
      console.log('Decompressing token:', selectedToken);
      // Implement your decompression logic here
      setIsDecompressingTokens(true);
    }
  }, [selectedToken]);

  // Render wallet connection prompt if not connected
  if (!connectedWallet) {
    return (
      <div className="flex justify-center items-center mt-24">
        <p className="text-gray-500 font-thin">Connect your wallet to manage your tokens</p>
      </div>
    );
  }

  // Render loading state while fetching tokens
  if (isFetchingCompressedTokens || isFetchingSplTokenAccounts) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center mt-24">
        <Loader className="w-5 h-5" />
        <p className="text-gray-500 font-thin">Fetching tokens...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="min-h-screen bg-gray-900 pt-24 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        {/* ToggleBar Positioned Above Outer Container */}
        <ToggleBar currentMode={mode} onToggle={handleToggleMode} />

        {/* Outer Container Box */}
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl mx-auto mt-6">
          {/* Search Input Shifted to the Left */}
          <div className="pb-2 mt-4 flex justify-start">
            <input
              value={search}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search for mint"
              className="w-80 p-2 rounded-md bg-gray-100 focus:outline-black text-gray-600 font-light"
              aria-label="Search for mint tokens"
            />
          </div>

          {/* Error Messages */}
          {errorFetchingCompressedTokens && (
            <p className="text-red-500 font-light text-sm text-center">
              {errorFetchingCompressedTokens || 'Error fetching compressed tokens.'}
            </p>
          )}
          {errorFetchingSplTokenAccounts && (
            <p className="text-red-500 font-light text-sm text-center">
              {errorFetchingSplTokenAccounts || 'Error fetching SPL token accounts.'}
            </p>
          )}

          {/* Token Selection Box */}
          <TokenBox
            tokens={tokensToRender}
            onTokenSelect={handleTokenSelect}
            selectedToken={selectedToken}
          />

          {/* Centered Action Button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={mode === 'Compression' ? handleCompress : handleDecompress}
              className="w-80 bg-purple-400 hover:bg-purple-500 transition-colors"
              disabled={!selectedToken}
              aria-disabled={!selectedToken}
            >
              {mode === 'Compression' ? 'Compress' : 'Decompress'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Modals for Decompression and Reclaiming */}
      <DecompressTokenModal
        open={isDecompressingTokens}
        onClose={() => setIsDecompressingTokens(false)}
        mint={selectedToken?.mint}
      />
      <ReclaimModal
        open={isReclaiming}
        onClose={() => setIsReclaiming(false)}
        tokenAccount={selectedToken as TokenAccount}
      />
    </>
  );
};

export default CompressedTokens;
