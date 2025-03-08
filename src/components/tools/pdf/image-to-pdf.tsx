'use client';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Trash2, GripVertical, Image as ImageIcon, FileUp, MoveUp, MoveDown } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Paper size options
const paperSizes = {
  'a4': { width: 595, height: 842 },
  'a5': { width: 420, height: 595 },
  'letter': { width: 612, height: 792 },
  'legal': { width: 612, height: 1008 },
};

type PaperSize = keyof typeof paperSizes;
type ImageFit = 'contain' | 'cover' | 'fill';
type PageOrientation = 'portrait' | 'landscape';

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface SortableImageItemProps {
  item: ImageItem;
  onRemove: (id: string) => void;
}

// Sortable image item component
const SortableImageItem = ({ item, onRemove }: SortableImageItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-3 p-3 bg-muted/50 rounded-md mb-2 group"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="h-16 w-16 relative overflow-hidden rounded-md border">
        <img 
          src={item.preview} 
          alt={item.file.name} 
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(item.file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export function ImageToPDF() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [imageFit, setImageFit] = useState<ImageFit>('contain');
  const [margin, setMargin] = useState(20);
  const [quality, setQuality] = useState(90);
  const [oneImagePerPage, setOneImagePerPage] = useState(true);
  const [filename, setFilename] = useState('converted');

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp']
    },
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
  });

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(image => image.id !== id);
      return filtered;
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setImages(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
        
        return newItems;
      });
    }
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;
    
    setConverting(true);
    setProgress(0);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const { width: pageWidth, height: pageHeight } = paperSizes[paperSize];
      
      // Apply orientation
      const actualWidth = orientation === 'portrait' ? pageWidth : pageHeight;
      const actualHeight = orientation === 'portrait' ? pageHeight : pageWidth;
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageBytes = await image.file.arrayBuffer();
        
        let pdfImage;
        const fileType = image.file.type.toLowerCase();
        
        if (fileType.includes('png')) {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else if (fileType.includes('jpg') || fileType.includes('jpeg')) {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else {
          // For other formats, we'd need to convert them first
          // This is a simplified example
          continue;
        }
        
        const page = pdfDoc.addPage([actualWidth, actualHeight]);
        
        const imgWidth = pdfImage.width;
        const imgHeight = pdfImage.height;
        
        // Calculate dimensions based on fit mode
        let drawWidth, drawHeight, drawX, drawY;
        
        const availableWidth = actualWidth - 2 * margin;
        const availableHeight = actualHeight - 2 * margin;
        
        if (imageFit === 'contain') {
          // Maintain aspect ratio, fit within margins
          const scale = Math.min(
            availableWidth / imgWidth,
            availableHeight / imgHeight
          );
          
          drawWidth = imgWidth * scale;
          drawHeight = imgHeight * scale;
          
          // Center the image
          drawX = margin + (availableWidth - drawWidth) / 2;
          drawY = margin + (availableHeight - drawHeight) / 2;
        } else if (imageFit === 'cover') {
          // Maintain aspect ratio, cover the page
          const scale = Math.max(
            availableWidth / imgWidth,
            availableHeight / imgHeight
          );
          
          drawWidth = imgWidth * scale;
          drawHeight = imgHeight * scale;
          
          // Center the image (some parts may be cropped)
          drawX = margin + (availableWidth - drawWidth) / 2;
          drawY = margin + (availableHeight - drawHeight) / 2;
        } else {
          // Fill: stretch to fill the available space
          drawWidth = availableWidth;
          drawHeight = availableHeight;
          drawX = margin;
          drawY = margin;
        }
        
        page.drawImage(pdfImage, {
          x: drawX,
          y: actualHeight - drawY - drawHeight, // PDF coordinates start from bottom-left
          width: drawWidth,
          height: drawHeight,
        });
        
        setProgress(((i + 1) / images.length) * 100);
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename || 'converted'}.pdf`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to convert images to PDF:', error);
      alert('Failed to convert images to PDF. Please try again.');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 dark:border-gray-600'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <p>Drag & drop images here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: PNG, JPG, JPEG, WEBP, GIF, BMP
              </p>
            </div>
          </div>
          
          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Images ({images.length})</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setImages([])}
                >
                  Remove All
                </Button>
              </div>
              
              <div className="max-h-80 overflow-y-auto pr-2">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext 
                    items={images.map(img => img.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {images.map(image => (
                      <SortableImageItem 
                        key={image.id} 
                        item={image} 
                        onRemove={handleRemoveImage} 
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">PDF Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filename">Output Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename (without .pdf)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paper-size">Paper Size</Label>
              <Select value={paperSize} onValueChange={(value) => setPaperSize(value as PaperSize)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select paper size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="a5">A5</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orientation">Orientation</Label>
              <Select value={orientation} onValueChange={(value) => setOrientation(value as PageOrientation)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-fit">Image Fit</Label>
              <Select value={imageFit} onValueChange={(value) => setImageFit(value as ImageFit)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image fit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contain">Contain (Preserve aspect ratio)</SelectItem>
                  <SelectItem value="cover">Cover (Fill and crop)</SelectItem>
                  <SelectItem value="fill">Fill (Stretch to fit)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="margin">Margin ({margin}px)</Label>
              </div>
              <Slider
                id="margin"
                min={0}
                max={100}
                step={5}
                value={[margin]}
                onValueChange={(value) => setMargin(value[0])}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="one-per-page">One Image Per Page</Label>
              <Switch
                id="one-per-page"
                checked={oneImagePerPage}
                onCheckedChange={setOneImagePerPage}
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Progress</h3>
          <div className="space-y-4">
            <Progress value={progress} max={100} />
            <div className="flex justify-between">
              <Label htmlFor="progress">Progress</Label>
              <span>{progress.toFixed(2)}%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 