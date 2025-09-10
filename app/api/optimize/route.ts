import { NextRequest, NextResponse } from 'next/server';
import { extractJobRequirements, scoreAndRewriteResume } from '@/lib/llm';
import { OptimizeRequestSchema } from '@/lib/schema';
import { redactForLogs } from '@/lib/scrub';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserCredits, consumeCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = OptimizeRequestSchema.parse(body);
    
    const { resumeText, jobAdText, role, saveSession } = validatedData;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check user credits (5 credits per optimization)
    const credits = await getUserCredits(session.user.id);
    if (credits.available < 5) {
      return NextResponse.json({ 
        error: 'Insufficient credits', 
        credits: credits.available,
        required: 5,
        needsPurchase: true 
      }, { status: 402 });
    }

    // Step 1: Extract job requirements
    console.log('Extracting job requirements...', redactForLogs({ role }));
    const requirements = await extractJobRequirements(jobAdText, role);

    // Step 2: Score and rewrite resume
    console.log('Scoring and rewriting resume...', redactForLogs({ score: 'processing' }));
    const result = await scoreAndRewriteResume(resumeText, requirements);

    // Consume 5 credits after successful optimization
    const creditConsumed = await consumeCredits(session.user.id, 5);
    if (!creditConsumed) {
      console.error('Failed to consume credits after optimization');
      // Don't fail the request, just log the error
    }

    // Log completion (without sensitive data)
    console.log('Optimization complete', redactForLogs({ 
      score: result.score, 
      bulletsCount: result.rewritten_bullets.length,
      saveSession,
      creditsUsed: 5
    }));

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('optimize error:', redactForLogs({ message }));
    
    if (message.includes('validation')) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to optimize resume. Please try again.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';


