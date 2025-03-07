export interface TranslateOptions {
  text: string;
  from: string;
  to: string;
}

export const translateService = {
  async translate(options: TranslateOptions): Promise<string> {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to translate text');
    }

    const data = await response.json();
    return data.translatedText;
  }
}; 