import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useZKCompression } from "@/context/zkCompressionContext";
import { MintCreatedModal } from "@/components/modals/MintCreatedSuccess";

type Props = {
  onSubmit?: () => void;
};

const CreateMint = ({ onSubmit }: Props) => {
  const { publicKey: connectedWallet } = useWallet();
  const { createMint } = useZKCompression();
  const { toast } = useToast();
  const [authority, setAuthority] = useState(connectedWallet?.toBase58() || "");
  const [decimals, setDecimals] = useState<string | number>(9);
  const [mintAmount, setMintAmount] = useState<string | number>("");  // Added mintAmount state
  const [isCreating, setIsCreating] = useState(false);
  const [newMintAddress, setNewMintAddress] = useState<string | null>(null);

  const canSend = !!authority && decimals !== "" && mintAmount !== "";  // Check mintAmount

  const handleCreateMint = async () => {
    if (!canSend) return;
    try {
      setIsCreating(true);

      const { mint: newMintPublicKey } = await createMint({
        authority: new PublicKey(authority),
        decimals: Number(decimals || 0),
        to: connectedWallet as PublicKey,  // Send minted tokens to connected wallet
        amount: Number(mintAmount),        // Specify amount to mint
      });

      setNewMintAddress(newMintPublicKey.toBase58());
      onSubmit?.();
    } catch (error: any) {
      const isInsufficientBalance = error?.message
        ?.toLowerCase()
        .includes("not enough balance");
      if (isInsufficientBalance) {
        toast({
          title: "Insufficient balance",
          description: "You do not have enough balance to mint tokens",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while creating the mint",
          variant: "destructive",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (!connectedWallet) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-900 to-gray-900">
        <p className="text-gray-500 font-thin">Connect your wallet to create a mint</p>
      </div>
    );
  }

  return (
    <div
    className="flex justify-center items-center min-h-screen"
    style={{ background: "rgb(15, 3, 63)" }} // Updated background color
  >
    <div className="p-10 max-w-lg w-full bg-opacity-90 rounded-xl shadow-lg backdrop-blur-lg border border-gray-300/50">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">Create Mint</h1>
      <div className="space-y-4">
        <div>
          <Label className="text-white">Decimals</Label>
          <Input
            className="w-full bg-white/30 text-white placeholder-gray-200 border-none rounded-lg px-4 py-2"
            disabled={isCreating}
            type="number"
            placeholder="9"
            value={decimals}
            onChange={(e) => {
              setDecimals(Number(e.target.value) > 0 ? Number(e.target.value) : "");
            }}
          />
        </div>
        <div>
          <Label className="text-white">Authority</Label>
          <Input
            className="w-full bg-white/30 text-white placeholder-gray-200 border-none rounded-lg px-4 py-2"
            disabled={isCreating}
            type="text"
            placeholder="0xqwerty..."
            value={authority}
            onChange={(e) => setAuthority(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-white">Mint Amount</Label>
          <Input
            className="w-full bg-white/30 text-white placeholder-gray-200 border-none rounded-lg px-4 py-2"
            disabled={isCreating}
            type="number"
            placeholder="Enter amount to mint"
            value={mintAmount}
            onChange={(e) => {
              setMintAmount(Number(e.target.value) > 0 ? Number(e.target.value) : "");
            }}
          />
        </div>
      </div>
      {isCreating ? (
        <div className="flex justify-center h-9 items-center">
          <Loader className="w-5" />
        </div>
      ) : (
        <Button
          className="mt-6 w-full bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:bg-purple-600 shadow-lg hover:shadow-purple-900 rounded-lg py-2"
          disabled={!canSend}
          onClick={handleCreateMint}
        >
          Create Mint and Mint Tokens
        </Button>
      )}
    </div>
    {newMintAddress && (
      <MintCreatedModal
        isOpen={!!newMintAddress}
        onClose={() => setNewMintAddress(null)}
        mintAddress={newMintAddress || ""}
      />
    )}
  </div>
  
  );
};

export default CreateMint;
