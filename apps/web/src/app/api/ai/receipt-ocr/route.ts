import { NextRequest, NextResponse } from 'next/server';
import { receiptOcrRequestSchema } from '@professor-academy/shared';
import { GeminiService } from '@/lib/services/gemini-service';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = receiptOcrRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid OCR request data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { imageBase64, mimeType } = parsed.data;

    // Run Gemini Vision OCR
    const ocrResult = await GeminiService.extractReceiptDetails(imageBase64, mimeType);

    // Duplicate TID check in Supabase
    let isDuplicateTid = false;
    let duplicateMessage: string | null = null;

    if (ocrResult.transactionId) {
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id, status, created_at')
        .eq('transaction_id', ocrResult.transactionId.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        isDuplicateTid = true;
        duplicateMessage = `Warning: Transaction ID "${ocrResult.transactionId}" has already been submitted in the system. Duplicate receipts will be rejected by Admin.`;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...ocrResult,
        isDuplicateTid,
        duplicateMessage,
      },
    });
  } catch (error) {
    console.error('Receipt OCR route error:', error);
    return NextResponse.json(
      { error: 'Failed to process receipt OCR' },
      { status: 500 }
    );
  }
}
