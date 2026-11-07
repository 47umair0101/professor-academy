import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const rows = await query(
      `SELECT id, role, full_name, email, phone, city, program, avatar_url, bio, created_at, updated_at
       FROM public.profiles
       WHERE id::text = $1 OR email = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = rows[0];
    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        role: profile.role,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone || '',
        city: profile.city || '',
        program: profile.program || '',
        avatarUrl: profile.avatar_url || '',
        bio: profile.bio || '',
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, fullName, phone, city, program, bio, avatarUrl } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or Email is required' },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name cannot be blank' },
        { status: 400 }
      );
    }

    // Upsert into public.profiles
    const rows = await query(
      `INSERT INTO public.profiles (
         id,
         role,
         full_name,
         email,
         phone,
         city,
         program,
         bio,
         avatar_url,
         updated_at
       )
       VALUES (
         $1::uuid,
         'STUDENT',
         $2,
         $3,
         $4,
         $5,
         $6,
         $7,
         $8,
         NOW()
       )
       ON CONFLICT (id) DO UPDATE SET
         full_name = EXCLUDED.full_name,
         phone = EXCLUDED.phone,
         city = EXCLUDED.city,
         program = EXCLUDED.program,
         bio = EXCLUDED.bio,
         avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
         updated_at = NOW()
       RETURNING *;`,
      [
        userId || '33333333-3333-3333-3333-333333333333',
        fullName.trim(),
        email || 'student@professoracademy.pk',
        phone ? phone.trim() : null,
        city ? city.trim() : null,
        program ? program.trim() : null,
        bio ? bio.trim() : null,
        avatarUrl || null,
      ]
    );

    const updated = rows[0];

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updated.id,
        role: updated.role,
        fullName: updated.full_name,
        email: updated.email,
        phone: updated.phone || '',
        city: updated.city || '',
        program: updated.program || '',
        avatarUrl: updated.avatar_url || '',
        bio: updated.bio || '',
        updatedAt: updated.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
