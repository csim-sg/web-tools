'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (number: string) => {
    if (display === '0') {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperator = (operator: string) => {
    setEquation(display + ' ' + operator + ' ');
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      const result = eval(equation + display);
      setDisplay(result.toString());
      setEquation('');
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Perform basic arithmetic calculations
        </p>
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="text-right bg-muted p-4 rounded mb-4">
            <div className="text-muted-foreground text-sm">{equation}</div>
            <div className="text-2xl font-medium">{display}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Button 
              onClick={handleClear} 
              variant="destructive" 
              className="col-span-2"
            >
              Clear
            </Button>
            <Button 
              onClick={() => handleOperator('/')} 
              variant="secondary"
            >
              ÷
            </Button>
            <Button 
              onClick={() => handleOperator('*')} 
              variant="secondary"
            >
              ×
            </Button>
            
            {[7, 8, 9].map((num) => (
              <Button 
                key={num} 
                onClick={() => handleNumber(num.toString())} 
                variant="outline"
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={() => handleOperator('-')} 
              variant="secondary"
            >
              -
            </Button>
            
            {[4, 5, 6].map((num) => (
              <Button 
                key={num} 
                onClick={() => handleNumber(num.toString())} 
                variant="outline"
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={() => handleOperator('+')} 
              variant="secondary"
            >
              +
            </Button>
            
            {[1, 2, 3].map((num) => (
              <Button 
                key={num} 
                onClick={() => handleNumber(num.toString())} 
                variant="outline"
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={handleEqual} 
              variant="default"
            >
              =
            </Button>
            
            <Button 
              onClick={() => handleNumber('0')} 
              variant="outline" 
              className="col-span-2"
            >
              0
            </Button>
            <Button 
              onClick={() => handleNumber('.')} 
              variant="outline"
            >
              .
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 