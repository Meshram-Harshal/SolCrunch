import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Hamburger Icon
import ConnectWalletButton from "@/components/ConnectWalletButton";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu state
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown on button click
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo on the left */}
          <Link to="/">
            <img
              src="/logo_main.png"
              alt="SolCrunch Logo"
              width={60}
              height={60}
              className="h-16 max-w-full w-auto" // Adjust the height and ensure max width for responsiveness
            />
          </Link>

          {/* Hamburger Icon for Mobile */}
          <div className="lg:hidden">
            <button onClick={toggleMobileMenu} className="text-white text-3xl">
              <FaBars />
            </button>
          </div>

          {/* Centered Navigation Menu */}
          <div className="hidden lg:flex flex-1 justify-center">
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
                <Link
                  to="/tx"
                  className="hover:text-purple-500 transition-colors"
                >
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side - Connect Wallet Button */}
          <div className="hidden lg:flex items-center">
            <ConnectWalletButton />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-black/70 backdrop-blur-lg rounded-lg p-4">
            <ul className="space-y-4 text-white text-lg">
              <li>
                <Link
                  to="/"
                  className="block hover:text-purple-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/Compression-Decompression"
                  className="block hover:text-purple-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Compression/Decompression
                </Link>
              </li>
              <li>
                <Link
                  to="/Minting-Forge"
                  className="block hover:text-purple-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Minting Forge
                </Link>
              </li>
              <li>
                <Link
                  to="/rent"
                  className="block hover:text-purple-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Your Rent
                </Link>
              </li>
              <li>
                <Link
                  to="/tx"
                  className="block hover:text-purple-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transactions
                </Link>
              </li>
              <li>
                <ConnectWalletButton />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
