import { CategoryLayout } from '@/components/CategoryLayout';
import { barcodeTools } from '@/lib/constants/tools';

export default function BarcodePage() {
  return (
    <CategoryLayout
      title="Barcode Tools"
      description="Generate and scan various types of barcodes for different purposes."
      tools={barcodeTools}
    />
  );
} 