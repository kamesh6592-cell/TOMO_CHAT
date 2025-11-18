import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/mailer';

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

    console.log('=== TEST EMAIL SEND ===');
    console.log('Recipient:', email);
    console.log('EMAIL_PROVIDER:', process.env.EMAIL_PROVIDER);
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

    const testUrl = 'https://chat.tomoacademy.site/verify?token=test-token-123';
    
    const result = await sendVerificationEmail(
      email,
      testUrl,
      'Test User'
    );

    if (result) {
      return NextResponse.json({
        success: true,
        message: `Test verification email sent successfully to ${email}`,
        details: {
          provider: process.env.EMAIL_PROVIDER || 'smtp',
          from: process.env.EMAIL_FROM || 'noreply@tomoacademy.site',
          to: email,
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email - check server logs',
        details: {
          provider: process.env.EMAIL_PROVIDER || 'smtp',
          from: process.env.EMAIL_FROM || 'noreply@tomoacademy.site',
          to: email,
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test Email Endpoint',
    usage: 'Send POST request with JSON body: { "email": "your@email.com" }',
    example: `
curl -X POST https://chat.tomoacademy.site/api/debug/test-email \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com"}'
    `.trim()
  });
}
