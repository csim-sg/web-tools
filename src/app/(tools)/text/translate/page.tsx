'use client';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  // Add more languages
];

export default function TextTranslator() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          from: sourceLang,
          to: targetLang
        })
      });
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Text Translator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full mb-2 p-2 rounded"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full h-48 p-4 rounded"
              placeholder="Enter text to translate..."
            />
          </div>
          
          <div>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full mb-2 p-2 rounded"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <textarea
              value={translatedText}
              readOnly
              className="w-full h-48 p-4 rounded bg-gray-100"
              placeholder="Translation will appear here..."
            />
          </div>
        </div>
        
        <button
          onClick={handleTranslate}
          disabled={loading || !sourceText}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
    </div>
  );
} 