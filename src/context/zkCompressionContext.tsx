import React, { createContext, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getLightRpc, getTxnForSigning } from "@/utils/zkCompression";
import { CompressedTokenProgram } from "@lightprotocol/compressed-token";
import { PublicKey } from "@solana/web3.js";
import {
  createZKMintIx,
  createZKTransferIx,
  createCompressTokenIx,
  createDecompressTokenIx,
} from "@/utils/zkInstructions";
import { TokenMetadata } from "@solana/spl-token-metadata";
import { Rpc } from "@lightprotocol/stateless.js";
import { createCloseAccountIx } from "@/utils/solana";
import { getAssociatedTokenAddress } from "@/utils/solana";

type CreateMintArgs = {
  authority?: PublicKey;
  decimals?: number;
  metadata?: TokenMetadata;
  to: PublicKey;
  amount: number;
};

type MintCompressedTokenArgs = {
  to: PublicKey;
  amount: number;
  mint: PublicKey;
  authority?: PublicKey;
};

type CompressTokenArgs = {
  mint: PublicKey;
  amount: number;
};

type DecompressTokenArgs = {
  mint: PublicKey;
  amount: number;
};

type BaseTxnResult = {
  txnSignature: string;
};

type TransferTokensArgs = {
  to: PublicKey;
  amount: number;
  mint: PublicKey;
};

export type CompressedTokenInfo = {
  mint: string;
  balance: number;
  compressed: boolean;
};

interface ZKCompressionContext {
  lightRpc: Rpc; // Ensure this is defined
  createMint: (
    args: CreateMintArgs,
  ) => Promise<BaseTxnResult & { mint: PublicKey }>;
  mintTokens: (args: MintCompressedTokenArgs) => Promise<BaseTxnResult>;
  transferTokens: (args: TransferTokensArgs) => Promise<BaseTxnResult>;
  compressToken: (args: CompressTokenArgs) => Promise<BaseTxnResult>;
  decompressToken: (args: DecompressTokenArgs) => Promise<BaseTxnResult>;
  reclaimRent: (args: {
    mint: PublicKey;
    owner: PublicKey;
  }) => Promise<BaseTxnResult>;
  compressAndReclaimRent: (args: CompressTokenArgs) => Promise<BaseTxnResult>;
}

const ZKCompressionContext = createContext<ZKCompressionContext | undefined>(undefined);

export function ZKCompressionProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const { publicKey: connectedWallet, sendTransaction } = useWallet();
  const lightRpc = getLightRpc(); // Initialize lightRpc here

  const createMint = async (args: CreateMintArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    console.log("creating mint instructions...");
    const { instructions, mintKp } = await createZKMintIx({
      creator: connectedWallet,
      authority: args.authority || connectedWallet,
      decimals: args.decimals || 9,
    });

    // Adjust the amount based on decimals
    const adjustedAmount = args.amount * (10 ** (args.decimals || 9));

    console.log("creating mint to instructions...");
    const mintTokensIx = await CompressedTokenProgram.mintTo({
      feePayer: connectedWallet,
      mint: mintKp.publicKey,
      authority: args.authority || connectedWallet,
      amount: adjustedAmount,
      toPubkey: args.to,
    });

    instructions.push(mintTokensIx);

    console.log("building txn...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash,
      [mintKp],
    );

    console.log("sending tx for signing...");
    const txnSignature = await sendTransaction(transaction, lightRpc, {
      signers: [mintKp],
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature: txnSignature,
    });

    console.log("tx confirmed:", txnSignature);
    console.log("new mint:", mintKp.publicKey);
    return { txnSignature, mint: mintKp.publicKey };
  };

  const mintTokens = async (args: MintCompressedTokenArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    const adjustedAmount = args.amount * (10 ** 9); // Assuming 9 decimals for the token

    console.log("creating mint to instructions...");
    const ix = await CompressedTokenProgram.mintTo({
      feePayer: connectedWallet,
      mint: args.mint,
      authority: args.authority || connectedWallet,
      amount: adjustedAmount,
      toPubkey: args.to,
    });

    console.log("building txn...");
    const transaction = getTxnForSigning(
      ix,
      connectedWallet,
      blockhashCtx.blockhash,
    );

    console.log("sending tx for signing...");
    const signature = await sendTransaction(transaction, lightRpc, {
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    });

    console.log("tx confirmed", signature);
    return { txnSignature: signature };
  };

  const transferTokens = async (args: TransferTokensArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    const { instructions } = await createZKTransferIx({
      owner: connectedWallet,
      mint: args.mint,
      amount: args.amount,
      to: args.to,
    });

    console.log("building txn...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash,
    );

    console.log("sending tx for signing...");
    const signature = await sendTransaction(transaction, lightRpc, {
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    });

    console.log("tx confirmed", signature);
    return {
      txnSignature: signature,
    };
  };

  // Compress existing NON-compressed SPL token and reclaim rent in a single transaction
  const compressAndReclaimRent = async (args: CompressTokenArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    console.log("creating compress token instructions...");
    const { instructions: compressInstructions } = await createCompressTokenIx({
      receiver: connectedWallet,
      mint: args.mint,
      amount: args.amount,
    });

    const ata = getAssociatedTokenAddress({
      owner: connectedWallet as PublicKey,
      mint: args.mint,
    });

    if (!ata) {
      throw new Error("No associated token address found");
    }

    console.log("creating close account instructions...");
    const closeAccountIx = await createCloseAccountIx({
      ata: ata.toBase58(),
      owner: connectedWallet.toBase58(),
    });

    // Combine the instructions into a single array
    const combinedInstructions = [...compressInstructions, closeAccountIx];

    console.log("building txn...");
    const transaction = getTxnForSigning(
      combinedInstructions,
      connectedWallet,
      blockhashCtx.blockhash,
    );

    console.log("sending tx for signing...");
    const signature = await sendTransaction(transaction, lightRpc, {
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    });

    console.log("tx confirmed", signature);
    return { txnSignature: signature };
  };

  const reclaimRent = async (args: { mint: PublicKey; owner: PublicKey; }) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    const ata = getAssociatedTokenAddress({
      owner: args.owner,
      mint: args.mint,
    });

    if (!ata) {
      throw new Error("No associated token address found");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    console.log("creating close account instructions...");
    const closeAccountIx = await createCloseAccountIx({
      ata: ata.toBase58(),
      owner: args.owner.toBase58(),
    });

    console.log("building txn...");
    const transaction = getTxnForSigning(
      [closeAccountIx],
      args.owner,
      blockhashCtx.blockhash,
    );

    console.log("sending tx for signing...");
    const signature = await sendTransaction(transaction, lightRpc, {
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    });

    console.log("tx confirmed", signature);
    return { txnSignature: signature };
  };

  const compressToken = async (args: CompressTokenArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    console.log("creating compress token instructions...");
    const { instructions } = await createCompressTokenIx({
      receiver: connectedWallet,
      mint: args.mint,
      amount: args.amount,
    });

    console.log("building txn...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash,
    );

    console.log("sending tx for signing...");
    const signature = await sendTransaction(transaction, lightRpc, {
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    });

    console.log("tx confirmed", signature);
    return { txnSignature: signature };
  };

  const decompressToken = async (args: DecompressTokenArgs) => {
    if (!connectedWallet) {
      throw new Error("No connected wallet");
    }

    console.log("getting blockhash...");
    const {
      context: { slot: minContextSlot },
      value: blockhashCtx,
    } = await lightRpc.getLatestBlockhashAndContext();

    console.log("creating decompress token instructions...");
    const { instructions } = await createDecompressTokenIx({
      owner: connectedWallet,
      mint: args.mint,
      amount: args.amount,
    });

    console.log("building txn...");
    const transaction = getTxnForSigning(
      instructions,
      connectedWallet,
      blockhashCtx.blockhash,
    );

    console.log("sending tx for signing...");
    const signature = await sendTransaction(transaction, lightRpc, {
      minContextSlot,
    });

    console.log("confirming tx...");
    await lightRpc.confirmTransaction({
      blockhash: blockhashCtx.blockhash,
      lastValidBlockHeight: blockhashCtx.lastValidBlockHeight,
      signature,
    });

    console.log("tx confirmed", signature);
    return { txnSignature: signature };
  };

  return (
    <ZKCompressionContext.Provider
      value={{
        lightRpc, // Ensure lightRpc is properly passed here
        createMint,
        mintTokens,
        transferTokens,
        compressToken,
        decompressToken,
        reclaimRent,
        compressAndReclaimRent,
      }}
    >
      {children}
    </ZKCompressionContext.Provider>
  );
}

export const useZKCompression = () => {
  const context = useContext(ZKCompressionContext);
  if (!context) {
    throw new Error(
      "useZKCompression must be used within a ZKCompressionProvider",
    );
  }
  return context;
};
