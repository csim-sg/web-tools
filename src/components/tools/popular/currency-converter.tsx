'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencyService } from '@/services/currency/currencyService';

interface ExchangeRates {
  [key: string]: number;
}

export function CurrencyConverter() {
  const [leftAmount, setLeftAmount] = useState<string>('1');
  const [rightAmount, setRightAmount] = useState<string>('');
  const [leftCurrency, setLeftCurrency] = useState<string>('USD');
  const [rightCurrency, setRightCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<ExchangeRates>({});
  const [activeInput, setActiveInput] = useState<'left' | 'right'>('left');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  const fetchRates = async () => {
    try {
      const rates = await currencyService.getExchangeRates();
      setRates(rates.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Calculate conversion whenever relevant values change
  useEffect(() => {
    if (!rates[leftCurrency] || !rates[rightCurrency]) return;

    if (activeInput === 'left' && leftAmount) {
      const leftAmountNum = parseFloat(leftAmount);
      if (isNaN(leftAmountNum)) {
        setRightAmount('');
        return;
      }

      // Convert from left currency to right currency
      const inUSD = leftAmountNum / rates[leftCurrency];
      const converted = inUSD * rates[rightCurrency];
      setRightAmount(converted.toFixed(2));
    } else if (activeInput === 'right' && rightAmount) {
      const rightAmountNum = parseFloat(rightAmount);
      if (isNaN(rightAmountNum)) {
        setLeftAmount('');
        return;
      }

      // Convert from right currency to left currency
      const inUSD = rightAmountNum / rates[rightCurrency];
      const converted = inUSD * rates[leftCurrency];
      setLeftAmount(converted.toFixed(2));
    }
  }, [leftAmount, rightAmount, leftCurrency, rightCurrency, rates, activeInput]);

  // Handle left amount change
  const handleLeftAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveInput('left');
    setLeftAmount(e.target.value);
  };

  // Handle right amount change
  const handleRightAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveInput('right');
    setRightAmount(e.target.value);
  };

  // Handle currency changes
  const handleLeftCurrencyChange = (value: string) => {
    setLeftCurrency(value);
    setActiveInput('left');
  };

  const handleRightCurrencyChange = (value: string) => {
    setRightCurrency(value);
    setActiveInput('right');
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Currency Container */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="left-currency">Currency</Label>
            <Select value={leftCurrency} onValueChange={handleLeftCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={`left-${currency}`} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="left-amount">Amount</Label>
            <Input
              id="left-amount"
              type="number"
              value={leftAmount}
              onChange={handleLeftAmountChange}
              placeholder="Enter amount"
              className="text-lg"
            />
          </div>
        </div>

        {/* Right Currency Container */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="right-currency">Currency</Label>
            <Select value={rightCurrency} onValueChange={handleRightCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={`right-${currency}`} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="right-amount">Amount</Label>
            <Input
              id="right-amount"
              type="number"
              value={rightAmount}
              onChange={handleRightAmountChange}
              placeholder="Enter amount"
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* Exchange Rate Information */}
      {rates[leftCurrency] && rates[rightCurrency] && (
        <div className="mt-6 p-4 bg-muted rounded-md text-center">
          <p className="text-sm text-muted-foreground">
            Exchange Rate: 1 {leftCurrency} = {(rates[rightCurrency] / rates[leftCurrency]).toFixed(4)} {rightCurrency}
          </p>
          <p className="text-sm text-muted-foreground">
            Exchange Rate: 1 {rightCurrency} = {(rates[leftCurrency] / rates[rightCurrency]).toFixed(4)} {leftCurrency}
          </p>
        </div>
      )}
    </Card>
  );
} 