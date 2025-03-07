import { Metadata } from 'next';
import { UnitConverter } from '@/components/tools/popular/UnitConverter';

export const metadata: Metadata = {
  title: 'Unit Converter - WebTools',
  description: 'Convert between different units of measurement including length, weight, and more',
  openGraph: {
    title: 'Unit Converter',
    description: 'Convert between different units of measurement including length, weight, and more',
  },
};

export default function UnitConverterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Unit Converter</h1>
      <UnitConverter />
    </div>
  );
} 