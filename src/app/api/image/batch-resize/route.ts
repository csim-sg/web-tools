import { NextResponse } from 'next/server';
import sharp from 'sharp';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);
    const maintainAspectRatio = formData.get('maintainAspectRatio') === 'true';
    const resizeMode = formData.get('resizeMode') as string;

    // Create zip archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    archive.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const resizedBuffer = await sharp(buffer)
        .resize({
          width,
          height,
          fit: resizeMode === 'fill' ? 'cover' : 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      archive.append(resizedBuffer, { name: `resized-${file.name}` });
    }

    await archive.finalize();

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="resized-images.zip"',
      },
    });

  } catch (error) {
    console.error('Batch resize failed:', error);
    return NextResponse.json(
      { error: 'Batch resize failed' },
      { status: 500 }
    );
  }
} 