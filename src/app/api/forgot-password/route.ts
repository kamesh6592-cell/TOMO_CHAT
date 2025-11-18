import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/mailer';
import { pgDb } from '@/lib/db/pg/db.pg';
import { UserTable } from '@/lib/db/pg/schema.pg';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    console.log(`[FORGOT PASSWORD] Request for: ${email}`);
    logger.info(`Password reset requested for: ${email}`);

    // Find user by email
    const [user] = await pgDb
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      console.log(`[FORGOT PASSWORD] User not found: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset email has been sent.',
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetUrl = `${process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    console.log(`[FORGOT PASSWORD] Sending reset email to: ${email}`);
    
    const result = await sendPasswordResetEmail(user.email, resetUrl, user.name || undefined);

    if (result) {
      console.log(`[FORGOT PASSWORD] ✅ Reset email sent to: ${email}`);
      logger.info(`Password reset email sent to: ${email}`);
      
      return NextResponse.json({
        success: true,
        message: 'Password reset email sent successfully. Check your inbox.',
      });
    } else {
      console.error(`[FORGOT PASSWORD] ❌ Failed to send reset email to: ${email}`);
      logger.error(`Failed to send password reset email to: ${email}`);
      
      return NextResponse.json({
        success: false,
        message: 'Failed to send email. Please try again later.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[FORGOT PASSWORD] 💥 Error:', error);
    logger.error('Error in forgot-password API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Forgot Password API',
    usage: 'POST with JSON: { "email": "user@example.com" }',
  });
}
