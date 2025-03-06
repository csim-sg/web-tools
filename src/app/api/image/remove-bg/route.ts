import { NextResponse } from 'next/server';
import { RemoveBgResult, removeBackgroundFromImageBase64 } from "remove.bg";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64img = buffer.toString('base64');

    const result = await removeBackgroundFromImageBase64({
      base64img,
      apiKey: process.env.REMOVE_BG_API_KEY!,
      size: 'regular',
      type: 'auto',
    });

    return new NextResponse(Buffer.from(result.base64img, 'base64'), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="no-background.png"',
      },
    });

  } catch (error) {
    console.error('Background removal failed:', error);
    return NextResponse.json(
      { error: 'Background removal failed' },
      { status: 500 }
    );
  }
} 