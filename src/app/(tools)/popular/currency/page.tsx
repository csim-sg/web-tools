'use client';
import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/utils/metadata';
import { currencyService } from '@/services/currency/currencyService';

interface ExchangeRates {
  [key: string]: number;
}

export const metadata: Metadata = generateMetadata('/popular/currency');

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<ExchangeRates>({});
  const [result, setResult] = useState<string>('');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  const fetchRates = async () => {
    try {
      const rates = await currencyService.getExchangeRates();
      setRates(rates.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const convertCurrency = () => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return;

    // Convert to USD first (base currency), then to target currency
    const inUSD = amountNum / rates[fromCurrency];
    const converted = inUSD * rates[toCurrency];
    
    setResult(`${amountNum} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Currency Converter</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={convertCurrency}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Convert
            </button>

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md text-center text-lg">
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 