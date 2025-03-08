'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AmortizationRow {
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function RepaymentCalculator() {
  // Local state for this calculator
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);

  const calculateRepayment = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 1200;
    const n = parseFloat(loanTerm) * 12;

    if (isNaN(P) || isNaN(r) || isNaN(n)) return;

    const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const schedule: AmortizationRow[] = [];
    let balance = P;

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = payment - interest;
      balance -= principal;

      schedule.push({
        payment: payment,
        principal: principal,
        interest: interest,
        balance: Math.max(0, balance)
      });
    }

    setAmortizationSchedule(schedule);
    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
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
          <Label>Interest Rate (%)</Label>
          <Input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Enter annual interest rate"
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
        <Button onClick={calculateRepayment} className="w-full">
          Calculate Repayment Schedule
        </Button>
      </div>

      {amortizationSchedule.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Payment: ${monthlyPayment}
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment #</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationSchedule.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>${row.payment.toFixed(2)}</TableCell>
                    <TableCell>${row.principal.toFixed(2)}</TableCell>
                    <TableCell>${row.interest.toFixed(2)}</TableCell>
                    <TableCell>${row.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </Card>
  );
} 