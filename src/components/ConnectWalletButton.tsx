import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatAddress } from "@/utils/solana";
import { useSolBalance } from "@/hooks/useSolBalance";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { WalletMinimal } from "lucide-react";

const WalletInfo = ({
  connectedWallet,
  onPress,
}: {
  connectedWallet: string;
  onPress: () => void;
}) => {
  return (
    <button
      onClick={onPress}
      className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer bg-purple-900/90 hover:bg-purple-800/90 w-full text-white shadow-md"
    >
      <WalletMinimal strokeWidth={1.25} size={16} />
      <p className="font-light">{formatAddress(connectedWallet)}</p>
    </button>
  );
};

const WalletPopoverMenu = ({
  closePopover,
  balance,
}: {
  closePopover: () => void;
  balance: string | number;
}) => {
  const { toast } = useToast();
  const { disconnect, publicKey: connectedWallet } = useWallet();

  const handleCopyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet.toBase58());
      toast({
        title: "Copied to clipboard",
        description: "Wallet address has been copied to your clipboard",
      });
      closePopover();
    }
  };

  const handleDisconnect = () => {
    disconnect();
    closePopover();
  };

  return (
    <div className="flex flex-col gap-0 items-start justify-start rounded-md bg-gray-800 text-white shadow-lg w-full">
      {/* Display the SOL balance */}
      <div className="px-3 py-2 w-full text-left text-xs font-semibold">
        Balance: {balance} SOL
      </div>
      <button
        onClick={handleCopyAddress}
        className="h-9 px-3 w-full text-left text-xs font-semibold cursor-pointer hover:bg-purple-700/80 transition duration-300 ease-in-out"
      >
        Copy Address
      </button>
      <button
        onClick={handleDisconnect}
        className="h-9 px-3 w-full text-left text-xs font-semibold cursor-pointer hover:bg-purple-700/80 transition duration-300 ease-in-out"
      >
        Disconnect
      </button>
    </div>
  );
};

const ConnectWalletButton = () => {
  const { setVisible } = useWalletModal();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { publicKey: connectedWallet } = useWallet();
  const { solBalance } = useSolBalance();

  if (connectedWallet) {
    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => setIsPopoverOpen(open)}
      >
        <PopoverAnchor className="flex items-center justify-center">
          <WalletInfo
            connectedWallet={connectedWallet.toBase58()}
            onPress={() => setIsPopoverOpen(true)}
          />
        </PopoverAnchor>
        <PopoverContent className="w-40 p-0 mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          <WalletPopoverMenu
            closePopover={() => setIsPopoverOpen(false)}
            balance={solBalance}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <button style={{ padding: "10px" }}
        className="bg-gradient-to-r from-purple-700 to-purple-900 text-white h-10 rounded-md text-sm w-full shadow-lg hover:from-purple-600 hover:to-purple-800 transition-transform duration-300 ease-in-out"
        onClick={() => setVisible(true)}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWalletButton;
