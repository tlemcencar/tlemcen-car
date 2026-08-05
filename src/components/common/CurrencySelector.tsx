import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center bg-[#181820] p-1 rounded-full border border-white/10">
      <button
        onClick={() => setCurrency('DZD')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
          currency === 'DZD'
            ? 'bg-[#ff2e4d] text-white shadow-[0_0_12px_rgba(255,46,77,0.4)]'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        DA (DZD)
      </button>
      <button
        onClick={() => setCurrency('EUR')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
          currency === 'EUR'
            ? 'bg-[#ff2e4d] text-white shadow-[0_0_12px_rgba(255,46,77,0.4)]'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        € (EUR)
      </button>
    </div>
  );
};
