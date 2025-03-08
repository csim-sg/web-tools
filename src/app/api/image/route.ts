import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const action = formData.get('action') as string;
    const options = JSON.parse(formData.get('options') as string);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let processedBuffer: Buffer;

    switch (action) {
      case 'compress':
        processedBuffer = await sharp(buffer)
          .jpeg({ quality: options.quality })
          .toBuffer();
        break;

      case 'remove-bg':
        // For now, just return the original buffer
        // TODO: Implement actual background removal
        processedBuffer = buffer;
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Now processedBuffer is guaranteed to be assigned
    return new NextResponse(processedBuffer, {
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="processed-${file.name}"`
      }
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: 'Image processing failed' },
      { status: 500 }
    );
  }
} 