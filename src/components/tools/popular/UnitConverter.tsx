'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Define unit types with their conversion ratios
type UnitType = 'length' | 'weight' | 'temperature' | 'area'; // Add more as needed

// Define unit interfaces
interface UnitDefinition {
  symbol: string;
  label: string;
  ratio: number;
}

// Create a mapped type for all unit categories
type UnitCategories = {
  [K in UnitType]: Record<string, UnitDefinition>;
}

// Define the unit categories with their units
const unitCategories: UnitCategories = {
  length: {
    m: { symbol: 'm', label: 'Meter', ratio: 1 },
    km: { symbol: 'km', label: 'Kilometer', ratio: 1000 },
    cm: { symbol: 'cm', label: 'Centimeter', ratio: 0.01 },
    mm: { symbol: 'mm', label: 'Millimeter', ratio: 0.001 },
    mi: { symbol: 'mi', label: 'Mile', ratio: 1609.34 },
    yd: { symbol: 'yd', label: 'Yard', ratio: 0.9144 },
    ft: { symbol: 'ft', label: 'Foot', ratio: 0.3048 },
    in: { symbol: 'in', label: 'Inch', ratio: 0.0254 }
  },
  weight: {
    kg: { symbol: 'kg', label: 'Kilogram', ratio: 1 },
    g: { symbol: 'g', label: 'Gram', ratio: 0.001 },
    mg: { symbol: 'mg', label: 'Milligram', ratio: 0.000001 },
    lb: { symbol: 'lb', label: 'Pound', ratio: 0.453592 },
    oz: { symbol: 'oz', label: 'Ounce', ratio: 0.0283495 }
  },
  temperature: {
    c: { symbol: '°C', label: 'Celsius', ratio: 1 },
    f: { symbol: '°F', label: 'Fahrenheit', ratio: 1 },
    k: { symbol: 'K', label: 'Kelvin', ratio: 1 }
  },
  area: {
    m2: { symbol: 'm²', label: 'Square Meter', ratio: 1 },
    km2: { symbol: 'km²', label: 'Square Kilometer', ratio: 1000000 },
    cm2: { symbol: 'cm²', label: 'Square Centimeter', ratio: 0.0001 },
    mm2: { symbol: 'mm²', label: 'Square Millimeter', ratio: 0.000001 },
    ha: { symbol: 'ha', label: 'Hectare', ratio: 10000 },
    acre: { symbol: 'acre', label: 'Acre', ratio: 4046.86 },
    ft2: { symbol: 'ft²', label: 'Square Foot', ratio: 0.092903 },
    in2: { symbol: 'in²', label: 'Square Inch', ratio: 0.00064516 }
  }
};

export function UnitConverter() {
  const [selectedType, setSelectedType] = useState<UnitType>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [fromValue, setFromValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const handleConvert = (value: string, from: string, to: string) => {
    if (!value) {
      setResult('');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setResult('Invalid input');
      return;
    }
    
    // Special handling for temperature
    if (selectedType === 'temperature') {
      let convertedValue: number;
      
      // Convert to Celsius first
      let celsius: number;
      if (from === 'c') celsius = numValue;
      else if (from === 'f') celsius = (numValue - 32) * 5/9;
      else if (from === 'k') celsius = numValue - 273.15;
      else {
        setResult('Invalid unit');
        return;
      }
      
      // Convert from Celsius to target
      if (to === 'c') convertedValue = celsius;
      else if (to === 'f') convertedValue = celsius * 9/5 + 32;
      else if (to === 'k') convertedValue = celsius + 273.15;
      else {
        setResult('Invalid unit');
        return;
      }
      
      setResult(convertedValue.toFixed(2));
      return;
    }
    
    // For other unit types
    const category = unitCategories[selectedType];
    const fromRatio = category[from]?.ratio;
    const toRatio = category[to]?.ratio;
    
    if (fromRatio === undefined || toRatio === undefined) {
      setResult('Invalid unit');
      return;
    }
    
    const convertedValue = (numValue * fromRatio) / toRatio;
    setResult(convertedValue.toFixed(6));
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    handleConvert(value, fromUnit, toUnit);
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="length" onValueChange={(value) => setSelectedType(value as UnitType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="area">Area</TabsTrigger>
        </TabsList>

        {Object.keys(unitCategories).map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={fromValue}
                    onChange={(e) => handleFromValueChange(e.target.value)}
                    placeholder="Enter value"
                    className="flex-1"
                  />
                  <Select
                    value={fromUnit}
                    onValueChange={(value) => {
                      setFromUnit(value);
                      handleConvert(fromValue, value, toUnit);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(unitCategories[type as UnitType]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={result}
                    readOnly
                    className="flex-1"
                  />
                  <Select
                    value={toUnit}
                    onValueChange={(value) => {
                      setToUnit(value);
                      handleConvert(fromValue, fromUnit, value);
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(unitCategories[type as UnitType]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
} 