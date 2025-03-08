'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RateCalculator from '@/components/tools/popular/loan-calculator/rate-calculator';
import RepaymentCalculator from '@/components/tools/popular/loan-calculator/repayment-calculator';

export default function LoanCalculator() {
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
          <RateCalculator />
        </TabsContent>

        <TabsContent value="repayment">
          <RepaymentCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
} 