import { NextResponse } from 'next/server';
import { GeminiService } from '@/lib/services/gemini-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionPrompt, rubricOrExpectedAnswer, studentAnswer, maxPoints } = body;

    if (!questionPrompt || !studentAnswer) {
      return NextResponse.json(
        { error: 'questionPrompt and studentAnswer are required.' },
        { status: 400 }
      );
    }

    const evaluation = await GeminiService.gradeWrittenAnswer({
      questionPrompt,
      rubricOrExpectedAnswer: rubricOrExpectedAnswer || '',
      studentAnswer,
      maxPoints: Number(maxPoints) || 5,
    });

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (error: any) {
    console.error('Grade Written Q/A API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to grade written answer.' },
      { status: 500 }
    );
  }
}
