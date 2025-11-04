import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendWelcomeEmail, sendNewLoginEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type } = body;

    if (type === 'welcome') {
      await sendWelcomeEmail({
        to: session.user.email,
        userName: session.user.name,
      });
      return NextResponse.json({ success: true, message: 'Welcome email sent' });
    }

    if (type === 'login') {
      const userAgent = req.headers.get('user-agent') || 'Unknown browser';
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
      
      await sendNewLoginEmail({
        to: session.user.email,
        userName: session.user.name,
        loginTime: new Date().toUTCString(),
        ipAddress: ip,
        location: 'Unknown city',
        browser: userAgent,
      });
      return NextResponse.json({ success: true, message: 'Login notification sent' });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
