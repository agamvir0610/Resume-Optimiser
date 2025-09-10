import { NextRequest, NextResponse } from 'next/server';
import { processFile } from '@/lib/fileProcessor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Process the file on the server side
    const result = await processFile(file);
    
    return NextResponse.json({
      name: result.name,
      type: result.type,
      text: result.text
    });
  } catch (error) {
    console.error('File processing error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
