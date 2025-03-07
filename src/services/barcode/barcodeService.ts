export interface BarcodeOptions {
  type: string;
  value: string;
  width?: number;
  height?: number;
  format?: 'svg' | 'png';
}

export const barcodeService = {
  async generate(options: BarcodeOptions): Promise<Blob> {
    const response = await fetch('/api/barcode/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to generate barcode');
    }

    return response.blob();
  }
}; 