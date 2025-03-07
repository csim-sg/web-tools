'use client';
import { useState } from 'react';
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/utils/metadata';

export const metadata: Metadata = generateMetadata('/utilities/calculator');

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (number: string) => {
    if (display === '0') {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperator = (operator: string) => {
    setEquation(display + ' ' + operator + ' ');
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      const result = eval(equation + display);
      setDisplay(result.toString());
      setEquation('');
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4">
          <div className="text-right bg-gray-100 p-4 rounded mb-4">
            <div className="text-gray-500 text-sm">{equation}</div>
            <div className="text-2xl">{display}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button onClick={handleClear} className="col-span-2 p-4 bg-red-500 text-white rounded hover:bg-red-600">
              Clear
            </button>
            <button onClick={() => handleOperator('/')} className="p-4 bg-gray-200 rounded hover:bg-gray-300">÷</button>
            <button onClick={() => handleOperator('*')} className="p-4 bg-gray-200 rounded hover:bg-gray-300">×</button>
            
            {[7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                {num}
              </button>
            ))}
            <button onClick={() => handleOperator('-')} className="p-4 bg-gray-200 rounded hover:bg-gray-300">-</button>
            
            {[4, 5, 6].map((num) => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                {num}
              </button>
            ))}
            <button onClick={() => handleOperator('+')} className="p-4 bg-gray-200 rounded hover:bg-gray-300">+</button>
            
            {[1, 2, 3].map((num) => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-4 bg-gray-100 rounded hover:bg-gray-200">
                {num}
              </button>
            ))}
            <button onClick={handleEqual} className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600">=</button>
            
            <button onClick={() => handleNumber('0')} className="col-span-2 p-4 bg-gray-100 rounded hover:bg-gray-200">0</button>
            <button onClick={() => handleNumber('.')} className="p-4 bg-gray-100 rounded hover:bg-gray-200">.</button>
          </div>
        </div>
      </div>
    </div>
  );
} 