import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown on button click
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed w-full top-0 left-0 z-10 bg-white/10 backdrop-blur-lg border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-0 py-0">
        <div className="flex justify-between items-center">
          {/* Logo on the left */}
          <Link to="/">
            <img
              src="/logo_main.png"
              alt="SolCrunch Logo"
              width={80}
              height={80}
              className="h-20 max-w-full w-auto" // Adjust the height and ensure max width
            />
          </Link>


          {/* Centered Navigation Menu */}
          <div className="flex-1 flex justify-center">
            <ul className="flex space-x-10 font-playpen text-lg text-white">
              {/* Home Tab */}
              <li>
                <Link
                  to="/"
                  className="hover:text-purple-500 transition-colors"
                >
                  Home
                </Link>
              </li>

              {/* Explore Tab with Dropdown */}
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="hover:text-purple-500 transition-colors"
                >
                  Explore
                </button>

                {/* Dropdown with smooth animation */}
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 mt-2 w-54 bg-black/70 backdrop-blur-lg rounded-lg shadow-lg z-10"
                  >
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/Compression-Decompression"
                          className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                          onClick={() => setDropdownOpen(false)} // Close on click
                        >
                          Compression/Decompression
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/Minting-Forge"
                          className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                          onClick={() => setDropdownOpen(false)} // Close on click
                        >
                          Minting Forge
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          to="/crunchy-swap"
                          className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                          onClick={() => setDropdownOpen(false)} // Close on click
                        >
                          Crunchy Swap
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          to="/rent"
                          className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                          onClick={() => setDropdownOpen(false)} // Close on click
                        >
                          Find Your Rent
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              {/* Transactions Tab */}
              <li>
                <Link to="/tx" className="hover:text-purple-500 transition-colors">
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side - Connect Wallet Button */}
          <div className="flex items-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
