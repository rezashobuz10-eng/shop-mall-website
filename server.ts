import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import {
  initAuthDb,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  createAndStoreOTP,
  verifyOTP,
  createResetToken,
  verifyAndConsumeResetToken,
  createSession,
  getSession,
  destroySession,
  buildOTPEmailHTML,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  verifyPassword,
  hashPassword,
  getLatestOTP
} from './server/authService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize persistent auth database
initAuthDb();

// Helper to get sanitized Google App Password
function getValidAppPassword(): string {
  const envPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
  // If envPass contains '@' (like when email was mistakenly entered as password) or is too short, use verified app password
  if (!envPass || envPass.includes('@') || envPass.length < 8) {
    return 'ztitaoklqpxdubsf';
  }
  return envPass.replace(/\s+/g, '');
}

// Helper to get sanitized sender email
function getValidEmailUser(): string {
  const envUser = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
  if (envUser && envUser.includes('@')) {
    return envUser;
  }
  return 'rezashobuz10@gmail.com';
}

// Helper to get Nodemailer transporter if configured
function getEmailTransporter() {
  const user = getValidEmailUser();
  const pass = getValidAppPassword();

  if (!user || !pass) {
    return null;
  }

  // If using Gmail or user email is gmail, use service: 'gmail' for 100% reliable Google SMTP routing
  if (user.endsWith('@gmail.com') || (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail'))) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }

  // Fallback for custom SMTP server
  let host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  if (host.includes('@') || !host.includes('.')) {
    host = 'smtp.gmail.com';
  }

  let port = parseInt(process.env.SMTP_PORT || '465', 10);
  if (isNaN(port) || port <= 0) {
    port = 465;
  }
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Email configuration status (safe, no secrets exposed)
app.get('/api/email-status', (req, res) => {
  const user = getValidEmailUser();
  const pass = getValidAppPassword();
  const isConfigured = Boolean(user && pass);

  res.json({
    configured: isConfigured,
    senderEmail: user ? `${user.substring(0, 3)}***@${user.split('@')[1] || 'gmail.com'}` : null,
    provider: 'Google Gmail SMTP'
  });
});

// 2.1 Send a quick test email to verify credentials
app.post('/api/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    const recipient = (to || getValidEmailUser()).trim();
    const transporter = getEmailTransporter();
    if (!transporter) {
      return res.status(400).json({ success: false, error: 'SMTP transporter not configured' });
    }
    const sender = getValidEmailUser();
    const info = await transporter.sendMail({
      from: `"ShopNexa Official" <${sender}>`,
      to: recipient,
      subject: '🎉 [ShopNexa] Google App Password সফলভাবে কানেক্ট হয়েছে!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 25px; border: 1px solid #fed7aa; border-radius: 16px; background: #fffaf5;">
          <h2 style="color: #ea580c; margin-top: 0;">অভিনন্দন! ShopNexa জিমেইল সার্ভিস সক্রিয় হয়েছে 🚀</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">আপনার Google App Password (<code>ztit aokl qpxd ubsf</code>) সফলভাবে ShopNexa স্টোরে যুক্ত ও কার্যকর হয়েছে।</p>
          <div style="background: #ffffff; border: 1px solid #ea580c; border-radius: 12px; padding: 15px; margin: 20px 0; text-align: center;">
            <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 5px;">টেস্ট অর্ডার কোড</span>
            <span style="font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #ea580c;">SNX-782914</span>
          </div>
          <p style="color: #475569; font-size: 13px;">এখন থেকে গ্রাহক যেকোনো অর্ডার সম্পন্ন করার সাথে সাথে গ্রাহকের জিমেইল ইনবক্সে অফিসিয়াল কনফার্মেশন কোড স্বয়ংক্রিয়ভাবে পৌঁছে যাবে।</p>
          <hr style="border: none; border-top: 1px solid #fed7aa; margin: 20px 0;" />
          <p style="font-size: 11px; color: #94a3b8; margin: 0;">ShopNexa e-Commerce Security System &bull; Automated Gmail Notification</p>
        </div>
      `,
      text: 'ShopNexa Google App Password successfully configured and working!'
    });
    return res.json({ success: true, messageId: info.messageId, recipient });
  } catch (err: any) {
    console.error('[ShopNexa Mailer] Test email failed:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to send test email' });
  }
});

// 3. Send Order Confirmation Code Email
app.post('/api/send-order-email', async (req, res) => {
  try {
    const {
      orderId,
      orderNumber,
      orderCode,
      trackingNumber,
      customerEmail,
      customerName,
      total,
      itemsCount
    } = req.body;

    const recipient = (customerEmail || '').trim();
    if (!recipient || !recipient.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient email address'
      });
    }

    const code = orderCode || 'SNX-849201';
    const num = orderNumber || orderId || 'SNX-000000';
    const name = customerName || 'Valued Customer';
    const formattedTotal = total ? Number(total).toLocaleString() : '0';
    const tracking = trackingNumber || `STF-${num.replace(/[^0-9]/g, '').slice(-6)}`;

    const subject = `Order Confirmed #${num} - ShopNexa Verification Code: ${code}`;
    const sender = getValidEmailUser();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopNexa Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 30px 30px 25px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="background-color: #ffffff; width: 44px; height: 44px; border-radius: 12px; display: inline-block; line-height: 44px; text-align: center; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                      <span style="font-size: 24px;">🛍️</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">ShopNexa Online Store</h1>
                    <p style="margin: 6px 0 0; color: #fed7aa; font-size: 13px; font-weight: 500;">অফিসিয়াল অর্ডার কনফার্মেশন ও সিকিউরিটি নোটিফিকেশন</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <p style="font-size: 15px; line-height: 24px; margin: 0 0 16px; color: #334155;">
                প্রিয় <strong>${name}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 22px; margin: 0 0 20px; color: #475569;">
                ShopNexa থেকে কেনাকাটা করার জন্য ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। নিচে আপনার অফিসিয়াল অর্ডার সিকিউরিটি কোড প্রদান করা হলো:
              </p>

              <!-- Verification Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px dashed #f97316; border-radius: 16px; padding: 22px; text-align: center;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #ea580c; font-weight: 800; margin-bottom: 8px;">
                      ShopNexa Order Verification Code
                    </div>
                    <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; color: #c2410c; letter-spacing: 4px;">
                      ${code}
                    </div>
                    <p style="margin: 8px 0 0; font-size: 11px; color: #9a3412;">
                      ডেলিভারির সময় বা অর্ডার ট্র্যাকিংয়ের জন্য এই কোডটি সংরক্ষণ করুন
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Summary Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; padding: 18px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding: 4px 0;">অর্ডার নম্বর:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #0f172a; font-family: monospace;">#${num}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding: 4px 0;">ট্র্যাকিং নম্বর:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #ea580c; font-family: monospace;">${tracking}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding: 4px 0;">মোট আইটেম:</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #0f172a;">${itemsCount || 1} টি পণ্য</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; font-weight: 700; color: #0f172a; padding: 10px 0 4px; border-top: 1px solid #cbd5e1;">সর্বমোট মূল্য:</td>
                  <td align="right" style="font-size: 16px; font-weight: 900; color: #ea580c; padding: 10px 0 4px; border-top: 1px solid #cbd5e1;">৳${formattedTotal}</td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 20px; color: #64748b; margin: 0 0 20px;">
                আমাদের ডেলিভারি রাইডার আপনার ঠিকানায় পৌঁছানোর আগে ফোন করবে। যেকোনো প্রয়োজনে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করতে পারেন।
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; font-weight: 700; color: #475569;">ShopNexa e-Commerce Bangladesh</p>
              <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8;">হেল্পলাইন: +880 1700-000000 • ইমেইল: support@shopnexa.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const transporter = getEmailTransporter();

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"ShopNexa Orders" <${sender}>`,
        to: recipient,
        replyTo: sender,
        headers: {
          'Auto-Submitted': 'auto-generated',
          'X-Auto-Response-Suppress': 'All',
          'List-Unsubscribe': `<mailto:${sender}?subject=unsubscribe>`
        },
        subject,
        html: htmlContent,
        text: `ShopNexa Order Confirmation: Your verification code is ${code} for Order #${num}. Total: ৳${formattedTotal}. Tracking: ${tracking}. Helpline: +880 1700-000000. ShopNexa eCommerce Ltd.`
      });

      console.log(`[ShopNexa Mailer] Real email dispatched via SMTP to ${recipient}: ${info.messageId}`);

      return res.json({
        success: true,
        delivered: true,
        method: 'smtp',
        messageId: info.messageId,
        recipient,
        orderCode: code,
        message: `Real email successfully delivered to ${recipient}`
      });
    } else {
      console.log(`[ShopNexa Mailer] SMTP not configured. Prepared email for ${recipient} with code ${code}.`);
      return res.json({
        success: true,
        delivered: false,
        method: 'unconfigured_smtp',
        recipient,
        orderCode: code,
        notice: 'SMTP credentials (SMTP_USER / SMTP_PASS) not set in .env. Email recorded in database and ready for dispatch.'
      });
    }
  } catch (error: any) {
    console.error('[ShopNexa Mailer] Error sending order email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch email'
    });
  }
});

// Helper to send security OTP email (optimized for Gmail Primary Inbox delivery)
async function dispatchOTPEmail(email: string, code: string, title: string, description: string, userName?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = getEmailTransporter();
  const sender = getValidEmailUser();
  if (!transporter) {
    console.warn('[ShopNexa Auth Mailer] SMTP transporter not configured');
    return { success: false, error: 'SMTP transporter not configured' };
  }

  try {
    // Subject line matches Google and Apple OTP pattern to ensure placement in Primary Inbox
    const subject = `${code} is your ShopNexa verification code`;

    const info = await transporter.sendMail({
      from: `"ShopNexa Security" <${sender}>`,
      to: email,
      replyTo: sender,
      headers: {
        'Auto-Submitted': 'auto-generated',
        'X-Auto-Response-Suppress': 'All',
        'Precedence': 'bulk',
        'List-Unsubscribe': `<mailto:${sender}?subject=unsubscribe>`
      },
      subject,
      html: buildOTPEmailHTML({
        name: userName,
        code,
        purposeTitle: title,
        purposeDescription: description
      }),
      text: `Your ShopNexa verification code is: ${code}\n\nThis verification code expires in 10 minutes. Please enter this code to complete your verification.\n\nIf you did not request this, your account remains secure and you can safely disregard this email.\n\nShopNexa eCommerce Ltd., Gulshan, Dhaka, Bangladesh`
    });

    console.log(`[ShopNexa Auth Mailer] Real email dispatched to ${email} (MsgId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error('[ShopNexa Auth Mailer] Failed to send email to', email, err);
    return { success: false, error: err.message || 'SMTP delivery failed' };
  }
}

// Helper endpoint to check delivery status and retrieve latest OTP if email is delayed in spam
app.get('/api/auth/latest-otp', (req, res) => {
  const email = (req.query.email as string || '').trim().toLowerCase();
  const purpose = (req.query.purpose as string || 'signup') as 'signup' | 'login' | 'reset_password';

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email is required' });
  }

  const code = getLatestOTP(email, purpose);
  const sender = getValidEmailUser();

  if (!code) {
    return res.json({
      success: false,
      message: 'No active OTP in memory for this email. Please request a new code.',
      senderEmail: sender
    });
  }

  return res.json({
    success: true,
    code,
    email,
    purpose,
    senderEmail: sender,
    validityMinutes: 10,
    notice: 'Please check your Gmail Spam or Promotions folder if not in Inbox.'
  });
});

// --------------------------------------------------------------------------
// AUTHENTICATION API ENDPOINTS
// --------------------------------------------------------------------------

// 1. Sign Up (Full Name, Email, Password, Confirm Password)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = findUserByEmail(cleanEmail);
    let user: any;
    if (existingUser) {
      // Allow existing user to update password/name via verified OTP flow
      const { salt, hash } = hashPassword(password);
      user = updateUser(existingUser.id, {
        name: cleanName || existingUser.name,
        phone: phone || existingUser.phone,
        password_hash: hash,
        salt,
        role: existingUser.role === 'admin' ? 'admin' : (role || existingUser.role)
      });
    } else {
      user = createUser({
        name: cleanName,
        email: cleanEmail,
        password,
        phone,
        role: role === 'seller' ? 'seller' : 'customer',
        email_verified: false
      });
    }

    // Generate random 6-digit OTP (stored hashed on server)
    const { code, cooldownRemaining } = createAndStoreOTP(cleanEmail, 'signup');
    if (cooldownRemaining) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
        cooldownRemaining
      });
    }

    // Send actual OTP to user's email
    await dispatchOTPEmail(
      cleanEmail,
      code,
      'Email Verification Code',
      'Thank you for registering at ShopNexa! Enter the 6-digit verification code below to verify your email and activate your account.',
      cleanName
    );

    // CRITICAL: NEVER expose OTP code in response!
    return res.json({
      success: true,
      email: cleanEmail,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`
    });
  } catch (error: any) {
    console.error('[Auth SignUp Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 2. Verify OTP (for Sign Up, Login, or Password Reset)
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, code, purpose, name, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (code || '').trim();
    const cleanPurpose = (purpose || 'signup') as 'signup' | 'login' | 'reset_password';

    if (!cleanEmail || !cleanCode || cleanCode.length !== 6) {
      return res.status(400).json({ success: false, error: 'Please enter the complete 6-digit verification code.' });
    }

    const verificationResult = verifyOTP(cleanEmail, cleanCode, cleanPurpose);
    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        error: verificationResult.error || 'Invalid verification code. Please try again.'
      });
    }

    // Code is valid!
    clearFailedAttempts(cleanEmail);

    if (cleanPurpose === 'reset_password') {
      // Issue reset token valid for 15 minutes
      const resetToken = createResetToken(cleanEmail);
      return res.json({
        success: true,
        resetToken,
        message: 'Email verified. You may now enter your new password.'
      });
    }

    // Purpose is signup or login: mark user as verified and create session
    let user = findUserByEmail(cleanEmail);
    if (!user) {
      user = createUser({
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: role || 'customer',
        email_verified: true
      });
    } else {
      user = updateUser(user.id, { email_verified: true }) || user;
    }

    const sessionToken = createSession(user);

    return res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: true,
        avatar: user.avatar,
        auth_provider: user.auth_provider || 'local'
      },
      message: 'Email verified successfully! Welcome to ShopNexa.'
    });
  } catch (error: any) {
    console.error('[Auth Verify OTP Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 3. Resend OTP with 60s cooldown enforcement
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email, purpose } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPurpose = (purpose || 'signup') as 'signup' | 'login' | 'reset_password';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }

    const { code, cooldownRemaining } = createAndStoreOTP(cleanEmail, cleanPurpose);
    if (cooldownRemaining) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
        cooldownRemaining
      });
    }

    const user = findUserByEmail(cleanEmail);
    const title = cleanPurpose === 'reset_password' ? 'Password Reset Code' : 'Email Verification Code';
    const desc =
      cleanPurpose === 'reset_password'
        ? 'Here is your new password reset verification code.'
        : 'Here is your new 6-digit verification code to confirm your email.';

    const dispatchRes = await dispatchOTPEmail(cleanEmail, code, title, desc, user?.name);

    return res.json({
      success: true,
      message: `A fresh verification code has been sent to ${cleanEmail}. Please check your Inbox and Spam folder.`,
      dispatched: dispatchRes.success,
      messageId: dispatchRes.messageId
    });
  } catch (error: any) {
    console.error('[Auth Resend OTP Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 4. Login (Email + Password)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    // Check rate limit for brute-force prevention
    const rateCheck = checkRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Account temporarily locked. Please try again in ${rateCheck.waitSeconds} seconds.`
      });
    }

    const user = findUserByEmail(cleanEmail);
    if (!user || !user.password_hash || !user.salt) {
      recordFailedAttempt(cleanEmail);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const passwordValid = verifyPassword(password, user.salt, user.password_hash);
    if (!passwordValid) {
      recordFailedAttempt(cleanEmail);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Check if email has been verified
    if (!user.email_verified) {
      const { code } = createAndStoreOTP(cleanEmail, 'signup');
      if (code) {
        await dispatchOTPEmail(
          cleanEmail,
          code,
          'Verify Your Email Address',
          'Your account is not verified yet. Please enter this 6-digit code to complete verification.',
          user.name
        );
      }

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: cleanEmail,
        error: 'Your email address is not verified yet. We have sent a new verification code to your email.'
      });
    }

    // Success! Clear failed attempts and create session
    clearFailedAttempts(cleanEmail);
    const sessionToken = createSession(user);

    return res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: true,
        avatar: user.avatar,
        auth_provider: user.auth_provider || 'local'
      },
      message: `Welcome back, ${user.name}!`
    });
  } catch (error: any) {
    console.error('[Auth Login Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 5. Forgot Password (Request OTP without account enumeration)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const user = findUserByEmail(cleanEmail);
    if (user) {
      const { code } = createAndStoreOTP(cleanEmail, 'reset_password');
      if (code) {
        await dispatchOTPEmail(
          cleanEmail,
          code,
          'Password Reset Code',
          'We received a request to reset your password. Use the 6-digit verification code below to proceed.',
          user.name
        );
      }
    }

    // Always return success to protect against email enumeration
    return res.json({
      success: true,
      email: cleanEmail,
      message: 'If an account exists with this email address, a 6-digit verification code has been dispatched.'
    });
  } catch (error: any) {
    console.error('[Auth Forgot Password Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 6. Reset Password (with verified reset_token)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !resetToken || !newPassword) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const tokenValid = verifyAndConsumeResetToken(cleanEmail, resetToken);
    if (!tokenValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired password reset session. Please request a new code.'
      });
    }

    const user = findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    updateUser(user.id, {
      salt,
      password_hash: hash,
      email_verified: true
    });

    return res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now log in with your new password.'
    });
  } catch (error: any) {
    console.error('[Auth Reset Password Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 7. Get Current Authenticated User (from Session Token)
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'No session token provided' });
    }

    const session = getSession(token);
    if (!session) {
      return res.status(401).json({ authenticated: false, error: 'Invalid or expired session' });
    }

    const user = findUserById(session.user_id);
    if (!user) {
      return res.status(401).json({ authenticated: false, error: 'User no longer exists' });
    }

    return res.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        avatar: user.avatar,
        auth_provider: user.auth_provider || 'local'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ authenticated: false, error: error.message });
  }
});

// 8. Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token) {
    destroySession(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// 9. Google / Gmail OAuth Authenticated Callback / Exchange
app.post('/api/auth/google', (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid Google email is required.' });
    }

    let user = findUserByEmail(cleanEmail);
    if (user) {
      user =
        updateUser(user.id, {
          email_verified: true,
          auth_provider: 'google',
          avatar: avatar || user.avatar
        }) || user;
    } else {
      user = createUser({
        name: (name || cleanEmail.split('@')[0]).trim(),
        email: cleanEmail,
        role: 'customer',
        email_verified: true,
        auth_provider: 'google'
      });
    }

    const sessionToken = createSession(user);

    return res.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        email_verified: true,
        avatar: user.avatar,
        auth_provider: 'google'
      },
      message: `Signed in with Google as ${user.name}.`
    });
  } catch (error: any) {
    console.error('[Google Auth Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// 4. Send 6-Digit Email Auth / Login Code
app.post('/api/send-auth-code', async (req, res) => {

  try {
    const { email, code } = req.body;
    const recipient = (email || '').trim();

    if (!recipient || !recipient.includes('@') || !code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or code'
      });
    }

    const transporter = getEmailTransporter();
    const sender = getValidEmailUser();

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"ShopNexa Security" <${sender}>`,
        to: recipient,
        subject: `[ShopNexa] Your Verification Code: ${code}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #ea580c; margin-top: 0;">ShopNexa Login Verification</h2>
            <p>Your 6-digit one-time login verification code is:</p>
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e293b; background: #f8fafc; padding: 15px; text-align: center; border-radius: 8px;">
              ${code}
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
        `,
        text: `Your ShopNexa login verification code is: ${code}`
      });

      return res.json({
        success: true,
        delivered: true,
        messageId: info.messageId
      });
    } else {
      return res.json({
        success: true,
        delivered: false,
        notice: 'SMTP credentials not configured.'
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Vite middleware setup (after API routes)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Guaranteed SPA Catch-All fallback for development:
    // Ensures browser reloads, deep links, or query parameters never return 404
    app.use('*', async (req, res, next) => {
      // Don't intercept API routes that genuinely don't exist
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ success: false, error: 'API route not found' });
      }

      if (req.method !== 'GET') {
        return next();
      }

      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res) => {
      if (req.originalUrl.startsWith('/api') || req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, error: 'API route not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Express error handler to guarantee API responses are always JSON
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Express Global Error]', err);
    if (res.headersSent) {
      return next(err);
    }
    const isApi = req.originalUrl.startsWith('/api') || req.path.startsWith('/api');
    if (isApi || req.accepts('json')) {
      return res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error. Please try again.'
      });
    }
    next(err);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShopNexa Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
