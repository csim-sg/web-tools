'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export default function LoanCalculator() {
  // Rate Calculator State
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  
  // Repayment Calculator State
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Loan Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate loan payments, interest rates, and view amortization schedules
        </p>
      </div>

      <Tabs defaultValue="rate">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rate">Rate Calculator</TabsTrigger>
          <TabsTrigger value="repayment">Repayment Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="rate">
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
        </TabsContent>

        <TabsContent value="repayment">
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 