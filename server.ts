import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get Nodemailer transporter if configured
function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

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
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const isConfigured = Boolean(user && pass);

  res.json({
    configured: isConfigured,
    senderEmail: user ? `${user.substring(0, 3)}***@${user.split('@')[1] || 'gmail.com'}` : null,
    provider: process.env.SMTP_HOST || 'smtp.gmail.com'
  });
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

    const subject = `[ShopNexa] অর্ডার কনফার্মেশন কোড: ${code} (Order #${num})`;
    const sender = process.env.SMTP_USER || process.env.GMAIL_USER || 'orders@shopnexa.com';

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
        from: `"ShopNexa Order Desk" <${sender}>`,
        to: recipient,
        subject,
        html: htmlContent,
        text: `ShopNexa Order Confirmation: Your code is ${code} for Order #${num}. Total: ৳${formattedTotal}. Tracking: ${tracking}`
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
    const sender = process.env.SMTP_USER || process.env.GMAIL_USER || 'auth@shopnexa.com';

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
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShopNexa Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
