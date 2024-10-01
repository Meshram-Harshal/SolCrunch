import React, { useState } from 'react';
import { AiOutlineSwap } from 'react-icons/ai';

const Swap = () => {
  const [sellingCoin, setSellingCoin] = useState('USDC');
  const [buyingCoin, setBuyingCoin] = useState('SOL');
  const [amount, setAmount] = useState('');

  const handleSwap = () => {
    console.log(`Swapping ${amount} ${sellingCoin} for ${buyingCoin}`);
    
    // Swap the coins
    const temp = sellingCoin;
    setSellingCoin(buyingCoin);
    setBuyingCoin(temp);
    setAmount(''); // Reset the amount after swap
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-lg bg-opacity-50 backdrop-blur-md relative">
        <div className="p-4 bg-gray-700 rounded-lg">
          <h2 className="text-white text-2xl font-bold mb-2">You're Selling</h2>
          <div className="flex items-center mb-0">
            <select
              value={sellingCoin}
              onChange={(e) => setSellingCoin(e.target.value)}
              className="bg-gray-600 text-white rounded-md p-2 mr-2"
            >
              <option value="USDC">USDC</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-gray-600 text-white rounded-md p-2 flex-1"
            />
          </div>
        </div>

        {/* Swap Icon */}
        <div style={{marginTop:'5px'}} className="absolute top-3/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={handleSwap}
            className="flex items-center justify-center text-white bg-purple-600 rounded-full p-2 transition-transform transform hover:scale-110 shadow-lg"
          >
            <AiOutlineSwap size={24} className="transform rotate-90" /> {/* Rotating the icon */}
          </button>
        </div>

        <div className="p-4 bg-gray-700 rounded-lg mt-2">
          <h2 className="text-white text-2xl font-bold mb-2">You're Buying</h2>
          <div className="flex items-center mb-0">
            <select
              value={buyingCoin}
              onChange={(e) => setBuyingCoin(e.target.value)}
              className="bg-gray-600 text-white rounded-md p-2 mr-2"
            >
              <option value="SOL">SOL</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
            </select>
            <input
              type="number"
              readOnly
              value={(amount * 1).toFixed(2)} // Display the swapped amount here
              placeholder="0.00"
              className="bg-gray-600 text-white rounded-md p-2 flex-1"
            />
          </div>
        </div>

        {/* Submit Swap Button */}
        <div className="mt-5 flex justify-center">
          <button
            className="text-white bg-purple-600 hover:bg-purple-700 rounded-full p-4 transition duration-300 shadow-lg w-full"
          >
        Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
