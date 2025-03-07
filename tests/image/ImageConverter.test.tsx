import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageConverter } from '@/app/(tools)/image/converter/page';
import { imageService } from '@/services/image/imageService';

jest.mock('@/services/image/imageService');

describe('ImageConverter', () => {
  const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file upload and format selection', () => {
    render(<ImageConverter />);
    expect(screen.getByLabelText(/choose file/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
  });

  it('handles file conversion successfully', async () => {
    const mockBlob = new Blob(['converted'], { type: 'image/jpeg' });
    (imageService.convertImage as jest.Mock).mockResolvedValue(mockBlob);

    render(<ImageConverter />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, mockFile);
    
    const convertButton = screen.getByRole('button', { name: /convert/i });
    await userEvent.click(convertButton);

    await waitFor(() => {
      expect(imageService.convertImage).toHaveBeenCalledWith(
        mockFile,
        expect.any(Object)
      );
    });
  });

  it('displays error message on conversion failure', async () => {
    (imageService.convertImage as jest.Mock).mockRejectedValue(
      new Error('Conversion failed')
    );

    render(<ImageConverter />);
    
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, mockFile);
    
    const convertButton = screen.getByRole('button', { name: /convert/i });
    await userEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText(/conversion failed/i)).toBeInTheDocument();
    });
  });
}); 