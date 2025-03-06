import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import bwipjs from 'bwip-js';

export async function POST(req: NextRequest) {
  try {
    const { type, input, size, color, backgroundColor } = await req.json();

    let buffer: Buffer;

    switch (type) {
      case 'qr':
        buffer = await QRCode.toBuffer(input, {
          width: size,
          margin: 1,
          color: {
            dark: color,
            light: backgroundColor
          }
        });
        break;

      case 'code128':
      case 'ean13':
      case 'upca':
      case 'code39':
      case 'datamatrix':
      case 'pdf417':
        const canvas = await bwipjs.toBuffer({
          bcid: type,
          text: input,
          scale: size / 100,
          height: 10,
          includetext: true,
          textxalign: 'center',
          backgroundcolor: backgroundColor.replace('#', ''),
          barcolor: color.replace('#', '')
        });
        buffer = canvas;
        break;

      default:
        return new NextResponse('Invalid barcode type', { status: 400 });
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (error) {
    console.error('Barcode generation error:', error);
    return new NextResponse('Failed to generate barcode', { status: 500 });
  }
} 