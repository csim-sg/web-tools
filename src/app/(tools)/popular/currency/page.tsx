import { Metadata } from 'next';
import { CurrencyConverter } from '@/components/tools/popular/currency-converter';

export const metadata: Metadata = {
  title: 'Currency Converter - WebTools',
  description: 'Convert between different currencies using real-time exchange rates',
  openGraph: {
    title: 'Currency Converter',
    description: 'Convert between different currencies using real-time exchange rates',
  },
};

export default function CurrencyConverterPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Currency Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert between different currencies using real-time exchange rates
        </p>
      </div>
      
      <CurrencyConverter />
    </div>
  );
} 