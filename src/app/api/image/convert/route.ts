import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;
    const quality = parseInt(formData.get('quality') as string);

    if (!file || !format) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let sharpInstance = sharp(buffer);

    switch (format) {
      case 'jpeg':
      case 'jpg':
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    const convertedBuffer = await sharpInstance.toBuffer();

    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': `image/${format}`,
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    });

  } catch (error) {
    console.error('Image conversion failed:', error);
    return NextResponse.json(
      { error: 'Image conversion failed' },
      { status: 500 }
    );
  }
} 