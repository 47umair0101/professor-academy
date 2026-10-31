import { NextResponse } from 'next/server';
import { GeminiService } from '@/lib/services/gemini-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseTitle, lessonTitle, lessonContent, studentQuestion, chatHistory } = body;

    if (!courseTitle || !lessonTitle || !studentQuestion) {
      return NextResponse.json(
        { error: 'courseTitle, lessonTitle, and studentQuestion are required.' },
        { status: 400 }
      );
    }

    const tutorResult = await GeminiService.askStudyTutor({
      courseTitle,
      lessonTitle,
      lessonContent,
      studentQuestion,
      chatHistory: chatHistory || [],
    });

    return NextResponse.json({
      success: true,
      data: tutorResult,
    });
  } catch (error: any) {
    console.error('Study Tutor API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get tutor answer.' },
      { status: 500 }
    );
  }
}
