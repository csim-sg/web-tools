'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RateCalculator() {
  // Local state for this calculator
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  
  const calculateRate = () => {
    const P = parseFloat(monthlyPayment);
    const L = parseFloat(loanAmount);
    const n = parseFloat(loanTerm) * 12;

    if (isNaN(P) || isNaN(L) || isNaN(n)) return;

    // Using the loan payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // where c is the monthly interest rate
    // We solve for c using iteration (Newton's method)
    let c = 0.1; // initial guess
    for (let i = 0; i < 100; i++) {
      const f = L * (c * Math.pow(1 + c, n)) / (Math.pow(1 + c, n) - 1) - P;
      const f1 = L * (Math.pow(1 + c, n) * (n * c - Math.pow(1 + c, n) + n + 1)) / Math.pow(Math.pow(1 + c, n) - 1, 2);
      const c1 = c - f / f1;
      if (Math.abs(c1 - c) < 0.0000001) {
        setInterestRate((c1 * 1200).toFixed(2));
        break;
      }
      c = c1;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label>Monthly Payment ($)</Label>
          <Input
            type="number"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
            placeholder="Enter monthly payment"
          />
        </div>
        <div>
          <Label>Loan Amount ($)</Label>
          <Input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
          />
        </div>
        <div>
          <Label>Loan Term (Years)</Label>
          <Input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="Enter loan term in years"
          />
        </div>
        <Button onClick={calculateRate} className="w-full">
          Calculate Interest Rate
        </Button>
        {interestRate && (
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              Interest Rate: {interestRate}%
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 