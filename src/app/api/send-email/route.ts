import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/mailer';
import { pgDb } from '@/lib/db/pg/db.pg';
import { UserTable } from '@/lib/db/pg/schema.pg';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, type } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [user] = await pgDb
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, an email has been sent.',
      });
    }

    let result = false;
    
    if (type === 'verification' || !type) {
      // Send verification email
      const verifyUrl = `${process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL}/verify?email=${encodeURIComponent(email)}`;
      result = await sendVerificationEmail(user.email, verifyUrl, user.name || undefined);
    } else if (type === 'reset') {
      // Send password reset email
      const resetToken = randomBytes(32).toString('hex');
      const resetUrl = `${process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
      result = await sendPasswordResetEmail(user.email, resetUrl, user.name || undefined);
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: `Email sent successfully to ${email}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email - check server logs',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Send Email Endpoint',
    usage: 'POST with JSON: { "email": "user@example.com", "type": "verification" or "reset" }',
  });
}
