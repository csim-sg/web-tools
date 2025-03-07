export const pdfService = {
  async convertToWord(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/convert/pdf-to-word', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to convert PDF to Word');
    }

    return response.blob();
  }
}; 