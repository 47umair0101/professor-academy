import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let avatarDataUrl = '';
    let targetUserId = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      targetUserId = (formData.get('userId') as string) || '';

      if (!file) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Invalid file format. Please upload an image (JPG, PNG, or WebP).' },
          { status: 400 }
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size exceeds maximum limit of 5MB.' },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      avatarDataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else {
      const body = await req.json();
      targetUserId = body.userId;
      avatarDataUrl = body.avatarUrl;

      if (!avatarDataUrl) {
        return NextResponse.json({ error: 'Avatar URL or image data is required' }, { status: 400 });
      }
    }

    const userId = targetUserId || '33333333-3333-3333-3333-333333333333';

    // Update avatar in public.profiles
    await query(
      `UPDATE public.profiles
       SET avatar_url = $1,
           updated_at = NOW()
       WHERE id::text = $2`,
      [avatarDataUrl, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarDataUrl,
    });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload profile photo' },
      { status: 500 }
    );
  }
}
