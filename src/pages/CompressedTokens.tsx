import React, { useState, useCallback, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { PublicKey } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { CompressedTokenInfo, useZKCompression } from '@/context/zkCompressionContext';
import { TokenAccount } from '@/utils/solana';
import { useCompressedTokenBalance } from '@/hooks/useCompressedTokenBalance';
import { useSplTokenAccounts } from '@/hooks/useSplTokenAccounts';
import { useToast } from '@/hooks/use-toast';

// Define a union type for tokens
type Token = CompressedTokenInfo | TokenAccount;

// Props for TokenBox component
interface TokenBoxProps {
  tokens: Token[];
  selectedTokens: Token[];
  onTokenToggle: (token: Token) => void;
}

// TokenBox Component
const TokenBox: React.FC<TokenBoxProps> = ({ tokens, selectedTokens, onTokenToggle }) => {
  const isSelected = (token: Token) => selectedTokens.some((t) => t.mint === token.mint);

  const formatBalance = (value: number): string => {
    // Check if value is zero
    if (value === 0) return '0';
    
    // Check if value is a whole number
    if (Number.isInteger(value)) return value.toString();

    // Return value with decimals
    return value.toString();
  };

  return (
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-full text-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-4">Select Token(s)</h3>
      <div className="overflow-y-auto h-56">
        {tokens.map((token) => (
          <div
            key={token.mint}
            className={`flex justify-between items-center bg-gray-700 rounded-lg p-3 mb-2 w-full cursor-pointer ${
              isSelected(token) ? 'border-2 border-purple-400' : ''
            }`}
            onClick={() => onTokenToggle(token)}
          >
            <div className="flex items-center overflow-hidden">
              <input
                type="checkbox"
                checked={isSelected(token)}
                onChange={() => onTokenToggle(token)}
                className="mr-2"
                aria-label={`Select token ${token.mint}`}
                onClick={(e) => e.stopPropagation()}
              />
              <p className="mr-2 truncate">{token.mint}</p>
              <span className="text-gray-400">
                {'balance' in token
                  ? formatBalance(Number(token.balance) / Math.pow(10, 9))
                  : formatBalance(Number(token.amount) / Math.pow(10, 9)) || '0'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

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
    {(['Compression', 'Decompression'] as const).map((mode) => (
      <button
        key={mode}
        aria-pressed={currentMode === mode}
        className={`px-7 py-3 font-semibold rounded-full transition-colors duration-300 ${
          currentMode === mode ? 'bg-purple-400 text-white' : 'bg-black text-gray-400'
        }`}
        onClick={() => onToggle(mode)}
      >
        {mode}
      </button>
    ))}
  </motion.div>
);

// Delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Main CompressedTokens Component
const CompressedTokens: React.FC = () => {
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

  // Compression Context
  const { compressAndReclaimRent, descompressToken } = useZKCompression();

  // Toast for notifications
  const { toast } = useToast();

  // State variables
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState<string>('');
  const [mode, setMode] = useState<'Compression' | 'Decompression'>('Compression');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleToggleMode = useCallback((newMode: 'Compression' | 'Decompression') => {
    setMode(newMode);
    setSelectedTokens([]);
    setSearch('');
  }, []);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleTokenToggle = useCallback((token: Token) => {
    setSelectedTokens((prev) => {
      const isAlreadySelected = prev.some((t) => t.mint === token.mint);
      return isAlreadySelected ? prev.filter((t) => t.mint !== token.mint) : [...prev, token];
    });
  }, []);

  const filteredTokens = React.useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    return (mode === 'Compression' ? splTokenAccounts : allCompressedTokens)?.filter((token) =>
      token.mint.toLowerCase().includes(lowercasedSearch)
    );
  }, [mode, splTokenAccounts, allCompressedTokens, search]);

  const tokensToRender = filteredTokens || [];

  const handleCompress = useCallback(async () => {
    if (selectedTokens.length === 0) return;

    try {
      setIsProcessing(true);

      for (const token of selectedTokens) {
        try {
          await compressAndReclaimRent({
            mint: new PublicKey(token.mint),
            amount: Number('balance' in token ? token.balance : token.amount),
          });
          toast({
            title: 'Token Compressed!',
            description: `Token ${token.mint} has been successfully compressed.`,
          });
        } catch (error: any) {
          const errorMessage = typeof error === 'string' ? error : error.message;
          const isInsufficientBalance = errorMessage
            ?.toLowerCase()
            .includes('not enough balance');

          if (isInsufficientBalance) {
            toast({
              title: 'Insufficient Balance',
              description: `You do not have enough balance to compress token ${token.mint}.`,
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Compression Failed',
              description:
                errorMessage || `An error occurred while compressing token ${token.mint}.`,
              variant: 'destructive',
            });
          }
        }

        await delay(30);
      }

      setSelectedTokens([]);
    } catch (error: any) {
      toast({
        title: 'Compression Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTokens, compressAndReclaimRent, toast]);

  const handleDecompress = useCallback(async () => {
    if (selectedTokens.length === 0) return;

    try {
      setIsProcessing(true);

      for (const token of selectedTokens) {
        try {
          await descompressToken({
            mint: new PublicKey(token.mint),
            amount: Number('balance' in token ? token.balance : token.amount),
          });
          toast({
            title: 'Token Decompressed',
            description: `Token ${token.mint} has been successfully decompressed.`,
          });
        } catch (error: any) {
          const errorMessage = typeof error === 'string' ? error : error.message;
          const isInsufficientBalance = errorMessage
            ?.toLowerCase()
            .includes('not enough balance');

          if (isInsufficientBalance) {
            toast({
              title: 'Insufficient Balance',
              description: `You do not have enough balance to decompress token ${token.mint}.`,
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Decompression Failed',
              description:
                errorMessage || `An error occurred while decompressing token ${token.mint}.`,
              variant: 'destructive',
            });
          }
        }

        await delay(30);
      }

      setSelectedTokens([]);
    } catch (error: any) {
      toast({
        title: 'Decompression Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTokens, descompressToken, toast]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mt-10 mb-5">Compressed Tokens</h1>
      <ToggleBar currentMode={mode} onToggle={handleToggleMode} />
      <input
        type="text"
        placeholder="Search Tokens..."
        value={search}
        onChange={handleSearchChange}
        className="mt-4 mb-4 p-2 w-full bg-gray-800 text-white border border-gray-700 rounded"
      />
      <TokenBox tokens={tokensToRender} selectedTokens={selectedTokens} onTokenToggle={handleTokenToggle} />
      <Button
        className="mt-5"
        onClick={mode === 'Compression' ? handleCompress : handleDecompress}
        disabled={isProcessing || selectedTokens.length === 0}
      >
        {isProcessing ? <Loader /> : `${mode} Selected Token(s)`}
      </Button>
      {(isFetchingCompressedTokens || isFetchingSplTokenAccounts) && (
        <Loader />
      )}
      {(errorFetchingCompressedTokens || errorFetchingSplTokenAccounts) && (
        <p className="text-red-500">Error fetching tokens!</p>
      )}
    </div>
  );
};

export default CompressedTokens;
