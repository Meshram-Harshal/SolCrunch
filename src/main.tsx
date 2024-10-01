import "./index.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import WalletProvider from "./context/walletContext";
import { ZKCompressionProvider } from "./context/zkCompressionContext";
import { TokenContextProvider } from "./context/tokensContexts";
import Navbar from "./components/layout/Navbar"; // Import Navbar instead of Sidebar
import Rent from './pages/Rent';

import TokenBalances from "./pages/CompressedTokens";
import CompressedMintDetail from "./pages/CompressedMintDetail";
import CreateMint from "./pages/CreateMint";
import Transactions from "./pages/Transactions";
import CompressedTokens from "./pages/CompressedTokens";
import Swap from "./pages/Swap"


const AppLayout = () => (
  <div className="flex flex-col h-screen">
    <Navbar /> {/* Include the Navbar */}
    <main className="flex-grow overflow-auto bg-gray-50"> {/* Added margin-top to avoid collision */}
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <TokenBalances />,
      },
      {
        path: "/Minting-Forge",
        element: <CreateMint />,
      },
      {
        path: "/tx",
        element: <Transactions />,
      },
      {
        path: "/rent",
        element: <Rent />,
      },
      {
        path: "/Compression-Decompression",
        element: <CompressedTokens />,
      },
      {
        path: "/Minting-Forge/:mint",
        element: <CompressedMintDetail />,
      },
      {
        path: "/crunchy-swap",
        element: <Swap />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletProvider>
      <ZKCompressionProvider>
        <TokenContextProvider>
          <RouterProvider router={router} />
        </TokenContextProvider>
      </ZKCompressionProvider>
    </WalletProvider>
    <Toaster />
  </StrictMode>,
);
