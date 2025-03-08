'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon } from 'lucide-react';

export function PowerPointToPDF() {
  const [file, setFile] = useState<File | null>(null);
} 