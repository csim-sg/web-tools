'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/lib/utils/toast';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (!chars) {
      showToast('Please select at least one character type', 'error');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      showToast('Password copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy password', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Password Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate secure passwords with custom requirements
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label>Password Length: {length}</Label>
            <Slider
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              min={8}
              max={64}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Include Uppercase Letters</Label>
              <Switch
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include Lowercase Letters</Label>
              <Switch
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include Numbers</Label>
              <Switch
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include Symbols</Label>
              <Switch
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full">
            Generate Password
          </Button>

          {password && (
            <div className="mt-4">
              <div className="flex gap-2">
                <Input
                  value={password}
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 