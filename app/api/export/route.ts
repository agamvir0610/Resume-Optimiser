import { NextRequest, NextResponse } from 'next/server';
import { generateDocxBuffer, generatePdfBuffer } from '@/lib/atsTemplates';
import { ExportRequestSchema } from '@/lib/schema';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserCredits, consumeCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Export request body:', JSON.stringify(body, null, 2));
    const validatedData = ExportRequestSchema.parse(body);
    console.log('Export validation passed');
    
    const { resultJson, format, userData } = validatedData;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check user credits
    const credits = await getUserCredits(session.user.id);
    if (credits.available < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }
    
    // Consume a credit
    const creditConsumed = await consumeCredits(session.user.id, 1);
    if (!creditConsumed) {
      return NextResponse.json({ error: 'Failed to consume credit' }, { status: 500 });
    }

    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    console.log('Generating document, format:', format);
    if (format === 'pdf') {
      buffer = await generatePdfBuffer(resultJson, userData);
      contentType = 'application/pdf';
      filename = 'resume.pdf';
    } else {
      buffer = await generateDocxBuffer(resultJson, userData);
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename = 'resume.docx';
    }
    console.log('Document generated, buffer size:', buffer.length);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('export error:', message);
    
    if (message.includes('validation')) {
      return NextResponse.json({ error: 'Invalid export data' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


