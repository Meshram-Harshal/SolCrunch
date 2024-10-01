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
    <nav className="bg-[#1a1a1a] shadow-lg border-b border-gray-800 text-white fixed w-full top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="flex justify-between items-center">
          {/* Logo on the left */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="SolCrunch Logo"
              className="h-12 w-30"  
            />
          </Link>



          {/* Centered Navigation Menu */}
          <div className="flex-1 flex justify-center">
            <ul className="flex space-x-10 font-playpen">
              {/* Home Tab */}
              <li>
                <Link to="/" className="hover:text-gray-300 transition-colors">
                  Home
                </Link>
              </li>

              {/* Explore Tab with Dropdown */}
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="hover:text-gray-300 transition-colors"
                >
                  Explore
                </button>

                {/* Dropdown with smooth animation */}
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 mt-2 w-54 bg-black bg-opacity-70 backdrop-blur-lg rounded-lg shadow-lg opacity-100 transform scale-100 transition-all duration-300 ease-in-out z-10"
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
                      <li>
                        <Link
                          to="/tx"
                          className="block px-4 py-2 hover:bg-gray-800 rounded transition-colors"
                          onClick={() => setDropdownOpen(false)} // Close on click
                        >
                          Transactions
                        </Link>
                      </li>
                      {/* New Find Your Rent Link */}
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

              {/* About Tab */}
              <li>
                <Link to="/about" className="hover:text-gray-300 transition-colors">
                  About
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
