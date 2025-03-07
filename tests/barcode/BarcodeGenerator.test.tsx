import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BarcodeGenerator } from '@/components/BarcodeGenerator';
import { barcodeService } from '@/services/barcode/barcodeService';

jest.mock('@/services/barcode/barcodeService');

describe('BarcodeGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields and type selection', () => {
    render(<BarcodeGenerator />);
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  it('generates barcode successfully', async () => {
    const mockBlob = new Blob(['barcode'], { type: 'image/svg+xml' });
    (barcodeService.generate as jest.Mock).mockResolvedValue(mockBlob);

    render(<BarcodeGenerator />);
    
    const valueInput = screen.getByLabelText(/value/i);
    await userEvent.type(valueInput, '12345');
    
    const generateButton = screen.getByRole('button', { name: /generate/i });
    await userEvent.click(generateButton);

    await waitFor(() => {
      expect(barcodeService.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          value: '12345'
        })
      );
    });
  });
}); 