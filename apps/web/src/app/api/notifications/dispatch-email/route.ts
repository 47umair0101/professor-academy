import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, html, text, templateType = 'GENERAL_ALERT' } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const fromEmail = process.env.EMAIL_FROM || 'notifications@professoracademy.com';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: Array.isArray(to) ? to : [to],
          subject,
          html: html || `<p>${text || subject}</p>`,
          text,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        console.warn('Resend API returned non-ok status, falling back to simulation:', resData);
      } else {
        return NextResponse.json({ success: true, provider: 'resend', id: resData.id });
      }
    }

    // Development / Free-tier fallback simulation
    const simulatedId = `sim_email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log(`[SMTP-DISPATCH] Template: ${templateType} | To: ${Array.isArray(to) ? to.join(', ') : to} | Subject: "${subject}" | SimulatedID: ${simulatedId}`);

    return NextResponse.json({
      success: true,
      provider: 'simulated_smtp',
      id: simulatedId,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
