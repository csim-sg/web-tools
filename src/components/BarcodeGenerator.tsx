'use client';
import { useState } from 'react';
import Image from 'next/image';
import * as z from 'zod';
import { FormWrapper } from './ui/form-wrapper';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from '@/components/ui/slider';
import { showToast } from '@/lib/utils/toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './ui/form';

const barcodeSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  size: z.number().min(100).max(400),
  color: z.string(),
  backgroundColor: z.string(),
  logo: z.string().optional(),
});

type BarcodeFormValues = z.infer<typeof barcodeSchema>;

interface BarcodeGeneratorProps {
  type: 'qr' | 'code128' | 'ean13' | 'upca' | 'code39' | 'datamatrix' | 'pdf417';
  title: string;
  description: string;
  validator?: (value: string) => boolean;
  placeholder?: string;
  maxLength?: number;
}

export default function BarcodeGenerator({
  type,
  title,
  description,
  validator,
  placeholder = 'Enter text or URL',
  maxLength = 100,
}: BarcodeGeneratorProps) {
  const [barcodeUrl, setBarcodeUrl] = useState('');

  const defaultValues: BarcodeFormValues = {
    content: '',
    size: 200,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    logo: '',
  };

  const generateBarcode = async (values: BarcodeFormValues) => {
    try {
      if (validator && !validator(values.content)) {
        showToast('Invalid input format', 'error');
        setBarcodeUrl('');
        return;
      }

      const response = await fetch('/api/barcode/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          input: values.content,
          size: values.size,
          color: values.color,
          backgroundColor: values.backgroundColor,
          logo: values.logo || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate barcode');
      }

      const blob = await response.blob();
      setBarcodeUrl(URL.createObjectURL(blob));
      showToast('Barcode generated successfully', 'success');
    } catch {
      showToast('Failed to generate barcode', 'error', {
        description: 'Please try again later',
      });
      setBarcodeUrl('');
    }
  };

  const handleDownload = () => {
    if (!barcodeUrl) return;

    const a = document.createElement('a');
    a.href = barcodeUrl;
    a.download = `${type}-barcode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast('Barcode downloaded', 'success');
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormWrapper
            schema={barcodeSchema}
            defaultValues={defaultValues}
            onSubmit={generateBarcode}
          >
            {(form) => (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={placeholder}
                          maxLength={maxLength}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size (px)</FormLabel>
                      <FormControl>
                        <Slider
                          min={100}
                          max={400}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value: number[]) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value}px
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {type === 'qr' && (
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="Enter logo URL"
                          />
                        </FormControl>
                        <FormDescription>
                          URL of the logo to place in the center of the QR code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              {...field}
                              className="w-full h-10"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              {...field}
                              className="w-full h-10"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Generate Barcode
                </Button>
              </div>
            )}
          </FormWrapper>

          <div className="flex flex-col items-center justify-center space-y-4">
            {barcodeUrl ? (
              <div className="p-4 bg-white rounded-lg shadow">
                <Image
                  src={barcodeUrl}
                  alt="Generated Barcode"
                  width={200}
                  height={200}
                  className="max-w-full h-auto"
                />
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Enter content to generate barcode
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
