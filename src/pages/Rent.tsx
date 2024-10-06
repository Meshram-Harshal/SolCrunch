import React, { useState, useCallback, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { PublicKey, Connection } from '@solana/web3.js';
import { Button } from '@/components/ui/button'; // Ensure this component exists
import { Loader } from '@/components/ui/loader'; // Ensure this component exists

const Rent: React.FC = () => {
    // State variables
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [tokenCount, setTokenCount] = useState<number | null>(null);
    const [calculatedSavings, setCalculatedSavings] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Access the mainnet RPC endpoint from environment variables
    const RPC_ENDPOINT = import.meta.env.VITE_MAINNET_RPC;

    // Handler for input change
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setWalletAddress(e.target.value.trim());
    }, []);

    // Handler for search button click
    const handleSearch = useCallback(async () => {
        // Reset previous state
        setErrorMessage('');
        setCalculatedSavings(null);
        setTokenCount(null);

        // Validate wallet address
        let publicKey: PublicKey;
        try {
            publicKey = new PublicKey(walletAddress);
        } catch (err) {
            setErrorMessage('Incorrect wallet address.');
            return;
        }

        setIsLoading(true);

        try {
            // Connect to Solana mainnet using the custom RPC endpoint
            const connection = new Connection(RPC_ENDPOINT, 'confirmed');

            // Token Program ID for SPL tokens
            const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

            // Fetch all token accounts for the wallet (including zero balances)
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            });

            // Count total token accounts (including those with zero balances)
            const totalAccounts = tokenAccounts.value.length;
            setTokenCount(totalAccounts);

            // Apply the formula: (count * 0.002039) - (count * 0.0000003)
            const savings = (totalAccounts * 0.002039) - (totalAccounts * 0.0000003);
            setCalculatedSavings(savings);
        } catch (error: any) {
            console.error(error);
            if (error.message.includes('403')) {
                setErrorMessage('Access forbidden. Please check your RPC endpoint or try again later.');
            } else {
                setErrorMessage('Failed to fetch tokens. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress, RPC_ENDPOINT]);

    return (
        <div
            style={{ background: "rgb(15, 3, 63)" }} // The outer background color
            className="min-h-screen flex items-center justify-center px-4"
        >
            <div className="relative bg-white/10 backdrop-blur-lg rounded-xl p-10 shadow-lg border border-white/20 w-full max-w-md">
                {/* Solana Icon */}
                <motion.div
                    className="flex justify-center mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                >
                    <img
                        src="https://cryptologos.cc/logos/solana-sol-logo.png"
                        alt="Solana Icon"
                        className="w-20 h-20"
                    />
                </motion.div>

                {/* Title */}
                <div className="flex justify-center">
                    <motion.h1
                        className="text-3xl font-extrabold text-white text-center mb-4 font-playpen"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Find your rent in SPL tokens
                    </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                    className="text-lg text-gray-300 mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    {/* Optional description text */}
                </motion.p>

                {/* Wallet Address Input */}
                <motion.div
                    className="relative flex justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <input
                        type="text"
                        placeholder="Wallet address..."
                        value={walletAddress}
                        onChange={handleInputChange}
                        className="font-playwrite px-5 py-3 rounded-full w-80 bg-white/30 text-gray-700 focus:outline-none shadow-lg"
                    />
                </motion.div>

                {/* Search Button */}
                <motion.div
                    className="flex justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <Button
                        onClick={handleSearch}
                        className="font-playpen px-6 py-3 bg-yellow-500 text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition"
                        disabled={isLoading || walletAddress === ''}
                    >
                        {isLoading ? <Loader className="w-4 h-4 text-white" /> : 'Search..'}
                    </Button>
                </motion.div>

                {/* Display token count */}
                {tokenCount !== null && (
                    <motion.div
                        className="text-center mt-4 text-xl text-blue-400 whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                    >
                        You have {tokenCount} token accounts.
                    </motion.div>
                )}

                {/* Display calculated savings */}
                {calculatedSavings !== null && (
                    <motion.div
                        className="text-center mt-8 text-xl text-green-400 whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.6 }}
                    >
                        You can save up to {calculatedSavings.toFixed(6)} SOL by <br /> Token Compression
                    </motion.div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <motion.div
                        className="mt-4 text-red-500 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                    >
                        {errorMessage}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Rent;
