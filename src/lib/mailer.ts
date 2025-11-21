import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";
import logger from "logger";

// Email provider type
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || "smtp"; // 'smtp' or 'resend'

// Log configuration on startup
logger.info(`Email provider configured: ${EMAIL_PROVIDER}`);
logger.info(
  `Email from address: ${process.env.EMAIL_FROM || "noreply@tomoacademy.site"}`,
);
logger.info(`Resend API key configured: ${!!process.env.RESEND_API_KEY}`);

// Resend configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient && RESEND_API_KEY) {
    console.log('[RESEND] Initializing Resend client with API key:', RESEND_API_KEY.substring(0, 10) + '...');
    resendClient = new Resend(RESEND_API_KEY);
  }
  if (!resendClient) {
    throw new Error("Resend API key not configured");
  }
  return resendClient;
}

// SMTP configuration (fallback)
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@tomoacademy.site";
const EMAIL_FROM_WITH_NAME = `TOMO <${EMAIL_FROM}>`;
const BASE_URL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

// Helper function to generate email header with logo
function getEmailHeader(title: string): string {
  return `
    <div class="logo">
      <img src="https://z-cdn-media.chatglm.cn/files/531d6781-d4fe-4528-b212-7bb657ffe656_aj-logo.jpg?auth_key=1763706080-d71c75270015490eadd199ee8fc860f0-0-5e8ce0b447263e908ab11329a900513e" alt="TOMO Logo">
    </div>
    
    <h1>${title}</h1>
  `;
}

// Helper function to generate user profile section
function getUserProfile(userName?: string, userImage?: string): string {
  if (!userName && !userImage) return '';
 
  return `
    <div class="user-profile">
      ${userImage ? `<img src="${userImage}" alt="${userName || 'User'}" />` : ''}
      ${userName ? `<div class="user-name">${userName}</div>` : ''}
    </div>
  `;
}

// Helper function to get location from IP and generate map
async function getLocationFromIP(ipAddress: string): Promise<{ city?: string; country?: string; lat?: number; lon?: number; location?: string }> {
  try {
    // Use ip-api.com free geolocation API (no key required)
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,city,lat,lon`);
    const data = await response.json();
   
    if (data.status === 'success') {
      return {
        city: data.city,
        country: data.country,
        lat: data.lat,
        lon: data.lon,
        location: `${data.city}, ${data.country}`,
      };
    }
  } catch (error) {
    logger.error('Failed to get location from IP:', error);
  }
  return {};
}

// Create reusable transporter for SMTP
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
      logger.warn("SMTP credentials not configured. Emails will not be sent.");
      // Return a test transporter for development
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: "test@ethereal.email",
          pass: "test",
        },
      });
    } else {
      transporter = nodemailer.createTransport(SMTP_CONFIG);
    }
  }
  return transporter;
}

// Email templates with updated design
const emailStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    background-color: #fff;
  }
  .logo {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  .logo img {
    height: 40px;
    width: auto;
  }
  h1 {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }
  p {
    margin-bottom: 15px;
  }
  .details {
    margin: 20px 0;
    padding: 15px;
    background-color: #f9f9f9;
    border-left: 4px solid #ddd;
  }
  .details p {
    margin: 5px 0;
  }
  .footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    font-size: 14px;
    color: #777;
  }
  a {
    color: #007bff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #000;
    color: white !important;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    margin: 15px 0;
    transition: background-color 0.2s;
  }
  .button:hover {
    background-color: #333;
    text-decoration: none;
  }
  .code-box {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    margin: 20px 0;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 2px;
  }
  .user-profile {
    text-align: center;
    margin: 20px 0;
  }
  .user-profile img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #ddd;
    object-fit: cover;
  }
  .user-profile .user-name {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 600;
  }
`;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using the configured email provider (Resend or SMTP)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    logger.info(
      `Attempting to send email to ${options.to} with subject: ${options.subject}`,
    );
    logger.info(
      `Using provider: ${EMAIL_PROVIDER}, Resend API Key: ${!!RESEND_API_KEY}`,
    );

    // Use Resend if configured and selected
    if (EMAIL_PROVIDER === "resend" && RESEND_API_KEY) {
      logger.info(`Sending via Resend from ${EMAIL_FROM_WITH_NAME}`);
      const resend = getResendClient();

      logger.info(`Resend API call starting...`);
      const { data, error } = await resend.emails.send({
        from: EMAIL_FROM_WITH_NAME,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text || stripHtml(options.html),
      });

      if (error) {
        logger.error("Failed to send email via Resend:", JSON.stringify(error));
        logger.error("Error details:", error);
        console.error("RESEND ERROR FULL:", error);
        return false;
      }

      logger.info(`Email sent via Resend: ${data?.id} to ${options.to}`);
      console.log("RESEND SUCCESS:", data);
      return true;
    }

    // Fallback to SMTP
    logger.info(`Sending via SMTP from ${EMAIL_FROM}`);
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
    });

    logger.info(`Email sent via SMTP: ${info.messageId} to ${options.to}`);

    // Log preview URL for ethereal.email testing
    if (SMTP_CONFIG.host.includes("ethereal")) {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return true;
  } catch (error) {
    logger.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
  email: string,
  verificationTokenOrUrl: string,
  userName?: string,
  userImage?: string,
): Promise<boolean> {
  // If it's already a full URL, use it; otherwise build the URL
  const verificationUrl = verificationTokenOrUrl.startsWith("http")
    ? verificationTokenOrUrl
    : `${BASE_URL}/api/auth/verify-email?token=${verificationTokenOrUrl}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>${emailStyles}</style>
    </head>
    <body>
        ${getEmailHeader('Verify Your Email')}
        
        <p>Hi${userName ? ` ${userName}` : ""},</p>
        
        <p>Thanks for signing up! We're excited to have you on board.</p>
        
        <p>To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <div class="details">
            <p><strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 14px;">${verificationUrl}</p>
        </div>
        
        <p style="font-size: 14px; color: #777;">
            This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} TOMO Academy</p>
            <p>For questions contact <a href="mailto:support@tomoacademy.site">support@tomoacademy.site</a></p>
        </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Verify your email address",
    html,
  });
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(
  email: string,
  userName?: string,
  userImage?: string,
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TOMO</title>
        <style>${emailStyles}</style>
    </head>
    <body>
        ${getEmailHeader('Welcome to TOMO!')}
        ${getUserProfile(userName, userImage)}
        
        <p>Hi${userName ? ` ${userName}` : ""},</p>
        
        <p>Your email has been verified successfully. You're all set to start using your account!</p>
        
        <p>Here are some quick tips to get you started:</p>
        <ul style="color: #333; line-height: 1.8;">
            <li>Complete your profile to personalize your experience</li>
            <li>Explore our features and tools</li>
            <li>Check out our documentation and guides</li>
            <li>Join our community and connect with other users</li>
        </ul>
        
        <div style="text-align: center;">
            <a href="${BASE_URL}/dashboard" class="button">Go to Dashboard</a>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} TOMO Academy</p>
            <p>For questions contact <a href="mailto:support@tomoacademy.site">support@tomoacademy.site</a></p>
        </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome! Your account is ready",
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetTokenOrUrl: string,
  userName?: string,
  userImage?: string,
): Promise<boolean> {
  // If it's already a full URL, use it; otherwise build the URL
  const resetUrl = resetTokenOrUrl.startsWith("http")
    ? resetTokenOrUrl
    : `${BASE_URL}/reset-password?token=${resetTokenOrUrl}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>${emailStyles}</style>
    </head>
    <body>
        ${getEmailHeader('Reset Your Password')}
        ${getUserProfile(userName, userImage)}
        
        <p>Hi${userName ? ` ${userName}` : ""},</p>
        
        <p>We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
        
        <p>To reset your password, click the button below:</p>
        
        <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <div class="details">
            <p><strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 14px;">${resetUrl}</p>
        </div>
        
        <p style="font-size: 14px; color: #777;">
            This password reset link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} TOMO Academy</p>
            <p>For questions contact <a href="mailto:support@tomoacademy.site">support@tomoacademy.site</a></p>
        </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
}

/**
 * Send login notification email (optional security feature)
 */
export async function sendLoginNotificationEmail(
  email: string,
  userName?: string,
  loginDetails?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    timestamp?: Date;
    userImage?: string;
  },
): Promise<boolean> {
  const timestamp = loginDetails?.timestamp || new Date();
 
  // Get location data from IP address
  let locationData: { city?: string; country?: string; lat?: number; lon?: number; location?: string } = {};
  if (loginDetails?.ipAddress && loginDetails.ipAddress !== 'Unknown') {
    locationData = await getLocationFromIP(loginDetails.ipAddress);
  }
 
  // Use fetched location or fallback to provided location
  const finalLocation = locationData.location || loginDetails?.location || 'Unknown';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Alert</title>
        <style>${emailStyles}</style>
    </head>
    <body>
        ${getEmailHeader('We\'ve noticed a new login')}
        ${getUserProfile(userName, loginDetails?.userImage)}
        
        <p>Hi${userName ? ` ${userName}` : ""},</p>
        
        <p>This is a routine security alert. Someone logged into your TOMO account from a new IP address:</p>
        
        <div class="details">
            <p><strong>Time:</strong> ${timestamp.toUTCString()}</p>
            ${loginDetails?.ipAddress ? `<p><strong>IP address:</strong> ${loginDetails.ipAddress}</p>` : ''}
            <p><strong>Location:</strong> ${finalLocation}</p>
            ${loginDetails?.userAgent ? `<p><strong>Browser:</strong> ${loginDetails.userAgent}</p>` : ''}
        </div>
        
        <p>If this was you, you can ignore this alert. If you noticed any suspicious activity on your account, please <a href="${BASE_URL}/reset-password">change your password</a> and <a href="${BASE_URL}/settings/security">enable two-factor authentication</a> on your <a href="${BASE_URL}/settings/security">account page</a>.</p>
        
        <p>So long, and thanks for all the fish,</p>
        <p><strong>The TOMO Team</strong></p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} TOMO Academy</p>
            <p>For questions contact <a href="mailto:support@tomoacademy.site">support@tomoacademy.site</a></p>
        </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "New login to your account",
    html,
  });
}

/**
 * Send email change verification
 */
export async function sendEmailChangeVerification(
  newEmail: string,
  verificationToken: string,
  userName?: string,
): Promise<boolean> {
  const verificationUrl = `${BASE_URL}/api/auth/verify-email-change?token=${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email Change</title>
        <style>${emailStyles}</style>
    </head>
    <body>
        ${getEmailHeader('Verify Email Change')}
        
        <p>Hi${userName ? ` ${userName}` : ""},</p>
        
        <p>You recently requested to change your email address. To confirm this change, please verify your new email address by clicking the button below:</p>
        
        <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify New Email</a>
        </div>
        
        <div class="details">
            <p><strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; font-size: 14px;">${verificationUrl}</p>
        </div>
        
        <p style="font-size: 14px; color: #777;">
            This verification link will expire in 24 hours. If you didn't request an email change, please contact support immediately.
        </p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} TOMO Academy</p>
            <p>For questions contact <a href="mailto:support@tomoacademy.site">support@tomoacademy.site</a></p>
        </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: newEmail,
    subject: "Verify your new email address",
    html,
  });
}

// Helper function to strip HTML tags for plain text version
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Export utility for testing email configuration
export async function testEmailConnection(): Promise<boolean> {
  try {
    // Test Resend connection
    if (EMAIL_PROVIDER === "resend" && RESEND_API_KEY) {
      getResendClient(); // Initialize Resend client
      logger.info("Resend API key configured, connection ready");
      return true;
    }

    // Test SMTP connection
    const transport = getTransporter();
    await transport.verify();
    logger.info("SMTP connection verified successfully");
    return true;
  } catch (error) {
    logger.error("Email connection failed:", error);
    return false;
  }
}
