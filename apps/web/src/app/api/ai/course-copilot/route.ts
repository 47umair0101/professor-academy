import { NextRequest, NextResponse } from 'next/server';
import { aiCoPilotPromptSchema } from '@professor-academy/shared';
import { GeminiService } from '@/lib/services/gemini-service';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = aiCoPilotPromptSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid AI prompt data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { mode, topic, examTarget, itemCount, rawContent } = parsed.data;

    if (mode === 'SYLLABUS') {
      const curriculum = await GeminiService.generateCurriculum(
        topic,
        examTarget || 'General Pakistan Academic & Entry Test'
      );
      return NextResponse.json({ success: true, data: curriculum });
    }

    if (mode === 'MCQS') {
      const mcqs = await GeminiService.generateMCQs(
        topic,
        examTarget || 'General Pakistan Academic & Entry Test',
        itemCount || 5
      );
      return NextResponse.json({ success: true, data: mcqs });
    }

    if (mode === 'POLISH' || mode === 'SUMMARY') {
      const polished = await GeminiService.polishLectureContent(
        rawContent || topic,
        mode
      );
      return NextResponse.json({ success: true, data: polished });
    }

    return NextResponse.json({ error: 'Unsupported AI mode' }, { status: 400 });
  } catch (error) {
    console.error('AI Co-Pilot route error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI Co-Pilot request' },
      { status: 500 }
    );
  }
}
