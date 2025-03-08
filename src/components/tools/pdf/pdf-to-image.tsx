'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { FileIcon, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  convertPDFToImages, 
  getPDFPageCount, 
  generatePDFThumbnails,
  ImageFormat 
} from '@/lib/utils/pdf-utils';

type PageSelection = 'all' | 'range' | 'custom';

interface PageThumbnail {
  pageNumber: number;
  dataUrl: string;
  selected: boolean;
}

export function PDFToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(90);
  const [dpi, setDpi] = useState(300);
  const [pageSelection, setPageSelection] = useState<PageSelection>('all');
  const [pageRange, setPageRange] = useState('');
  const [pageThumbnails, setPageThumbnails] = useState<PageThumbnail[]>([]);
  const [extractEmbeddedImages, setExtractEmbeddedImages] = useState(false);
  const [zipOutput, setZipOutput] = useState(true);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        setLoading(true);
        
        try {
          // Get page count
          const count = await getPDFPageCount(file);
          setPageCount(count);
          
          // Generate thumbnails
          const thumbnails = await generatePDFThumbnails(file, count);
          setPageThumbnails(thumbnails);
        } catch (error) {
          console.error('Error loading PDF:', error);
          alert('Failed to load PDF. Please try again with a valid PDF file.');
          setFile(null);
        } finally {
          setLoading(false);
        }
      }
    }
  });

  const handlePageSelectionChange = (value: PageSelection) => {
    setPageSelection(value);
    
    // Update selected pages based on selection type
    if (value === 'all') {
      setPageThumbnails(prev => 
        prev.map(page => ({ ...page, selected: true }))
      );
    } else if (value === 'custom') {
      // Keep current selection for custom
    } else {
      // For range, we'll update when the range input changes
    }
  };

  const handlePageRangeChange = (value: string) => {
    setPageRange(value);
    
    if (pageSelection === 'range') {
      try {
        // Parse the range string (e.g., "1-3, 5, 7-9")
        const selectedPages = new Set<number>();
        
        value.split(',').forEach(part => {
          part = part.trim();
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim()));
            for (let i = start; i <= end; i++) {
              if (i > 0 && i <= pageCount) {
                selectedPages.add(i);
              }
            }
          } else {
            const pageNum = parseInt(part);
            if (pageNum > 0 && pageNum <= pageCount) {
              selectedPages.add(pageNum);
            }
          }
        });
        
        // Update thumbnails based on parsed range
        setPageThumbnails(prev => 
          prev.map(page => ({
            ...page,
            selected: selectedPages.has(page.pageNumber)
          }))
        );
      } catch (error) {
        // If parsing fails, don't update the selection
        console.error('Error parsing page range:', error);
      }
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    if (pageSelection === 'custom') {
      setPageThumbnails(prev => 
        prev.map(page => 
          page.pageNumber === pageNumber 
            ? { ...page, selected: !page.selected } 
            : page
        )
      );
    }
  };

  const handleConvertToImages = async () => {
    if (!file) return;
    
    setConverting(true);
    setProgress(0);
    
    try {
      const selectedPages = pageThumbnails
        .filter(page => page.selected)
        .map(page => page.pageNumber);
      
      await convertPDFToImages({
        file,
        selectedPages,
        format,
        quality,
        dpi,
        zipOutput,
        extractEmbeddedImages,
        onProgress: setProgress
      });
    } catch (error) {
      console.error('Failed to convert PDF to images:', error);
      alert('Failed to convert PDF to images. Please try again.');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 dark:border-gray-600'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-12 h-12 text-muted-foreground" />
              <p>Drag & drop a PDF file here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 50MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • {pageCount} pages
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setPageCount(0);
                  setPageThumbnails([]);
                }}
              >
                Change File
              </Button>
            </div>
            
            {loading ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Loading PDF preview...</p>
              </div>
            ) : (
              <Tabs defaultValue="pages" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pages">Pages</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pages" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Page Selection</Label>
                    <Select 
                      value={pageSelection} 
                      onValueChange={(value) => handlePageSelectionChange(value as PageSelection)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Pages</SelectItem>
                        <SelectItem value="range">Page Range</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {pageSelection === 'range' && (
                      <div className="mt-2">
                        <Label htmlFor="page-range">Page Range</Label>
                        <Input
                          id="page-range"
                          placeholder="e.g., 1-3, 5, 7-9"
                          value={pageRange}
                          onChange={(e) => handlePageRangeChange(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter page numbers and/or ranges separated by commas
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {pageSelection === 'custom' && pageThumbnails.length > 0 && (
                    <div className="space-y-2">
                      <Label>Select Pages</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {pageThumbnails.map((page) => (
                          <div 
                            key={page.pageNumber}
                            className={`relative border rounded-md overflow-hidden cursor-pointer transition-all
                              ${page.selected ? 'ring-2 ring-primary' : 'opacity-70'}`}
                            onClick={() => togglePageSelection(page.pageNumber)}
                          >
                            <img 
                              src={page.dataUrl} 
                              alt={`Page ${page.pageNumber}`}
                              className="w-full h-auto"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                              Page {page.pageNumber}
                            </div>
                            <Checkbox
                              checked={page.selected}
                              className="absolute top-2 right-2 bg-white/90"
                              onCheckedChange={() => togglePageSelection(page.pageNumber)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Output Format</Label>
                      <Select value={format} onValueChange={(value) => setFormat(value as ImageFormat)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quality ({quality}%)</Label>
                      <Slider
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                        min={1}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>DPI ({dpi})</Label>
                      <Slider
                        value={[dpi]}
                        onValueChange={(value) => setDpi(value[0])}
                        min={72}
                        max={600}
                        step={1}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="zip-output"
                        checked={zipOutput}
                        onCheckedChange={setZipOutput}
                      />
                      <Label htmlFor="zip-output">Download as ZIP file</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="extract-images"
                        checked={extractEmbeddedImages}
                        onCheckedChange={setExtractEmbeddedImages}
                      />
                      <Label htmlFor="extract-images">Extract embedded images</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {!loading && (
              <div className="space-y-4">
                {converting ? (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-center text-muted-foreground">
                      Converting... {Math.round(progress)}%
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleConvertToImages}
                    disabled={!file || pageThumbnails.filter(p => p.selected).length === 0}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Convert to Images
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}