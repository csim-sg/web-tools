'use client';
import { useState } from 'react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voices.find(v => v.name === voice) || null;
    }
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Implementation similar to previous tools */}
    </div>
  );
} 