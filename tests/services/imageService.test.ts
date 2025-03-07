import { imageService } from '@/services/image/imageService';
import { env } from '@/config/env';

describe('imageService', () => {
  const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('converts image successfully', async () => {
    const mockBlob = new Blob(['converted'], { type: 'image/jpeg' });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(mockBlob),
    });

    const result = await imageService.convertImage(mockFile, {
      format: 'jpeg',
      quality: 80,
    });

    expect(result).toEqual(mockBlob);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/image/convert'),
      expect.any(Object)
    );
  });

  it('handles conversion error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(
      imageService.convertImage(mockFile, {
        format: 'jpeg',
        quality: 80,
      })
    ).rejects.toThrow('Failed to convert image');
  });
}); 