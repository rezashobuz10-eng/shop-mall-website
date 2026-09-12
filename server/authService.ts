import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  email_verified: boolean;
  salt: string;
  password_hash: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  auth_provider?: 'local' | 'google' | 'facebook';
}

export interface StoredOTP {
  email: string;
  otp_hash: string;
  plain_code?: string;
  purpose: 'signup' | 'login' | 'reset_password';
  expires_at: number; // timestamp in ms (10 minutes)
  attempts: number; // max 5
  last_sent_at: number; // for 60s cooldown
  created_at: string;
  used: boolean;
  used_at?: string;
}

export interface ResetToken {
  email: string;
  token: string;
  expires_at: number; // 15 minutes
  used: boolean;
  created_at: string;
}

export interface UserSession {
  token: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: number; // 7 days
}

interface AuthDatabase {
  users: AuthUser[];
  otps: Record<string, StoredOTP>;
  reset_tokens: Record<string, ResetToken>;
  sessions: Record<string, UserSession>;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'auth_db.json');

// In-memory cache backed by auth_db.json
let dbCache: AuthDatabase = {
  users: [],
  otps: {},
  reset_tokens: {},
  sessions: {}
};

// Rate limiting store for brute-force protection: ip/email -> { count, lockedUntil }
const loginAttemptMap = new Map<string, { count: number; lockedUntil: number }>();

export function initAuthDb(): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      dbCache = JSON.parse(content);
      if (!Array.isArray(dbCache.users)) dbCache.users = [];
      if (!dbCache.otps) dbCache.otps = {};
      if (!dbCache.reset_tokens) dbCache.reset_tokens = {};
      if (!dbCache.sessions) dbCache.sessions = {};
    } else {
      persistDb();
    }
  } catch (err) {
    console.error('[AuthDB] Error loading auth database:', err);
  }
}

function persistDb(): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AuthDB] Error persisting database:', err);
  }
}

// Password hashing using Scrypt with cryptographic salt
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (hashBuffer.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

// Hash 6-digit OTP code using SHA-256 for secure storage
export function hashOTP(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

// Generate cryptographically secure 6-digit OTP
export function generateRandomOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Brute-force check: max 5 failed attempts per 5 minutes
export function checkRateLimit(key: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginAttemptMap.get(key);
  if (!entry) return { allowed: true };

  if (entry.lockedUntil > now) {
    const waitSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Lock period has expired, reset
  if (entry.lockedUntil <= now && entry.lockedUntil > 0) {
    loginAttemptMap.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = loginAttemptMap.get(key) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockedUntil = now + 5 * 60 * 1000; // Lock for 5 minutes
  }
  loginAttemptMap.set(key, entry);
}

export function clearFailedAttempts(key: string): void {
  loginAttemptMap.delete(key);
}

// User methods
export function findUserByEmail(email: string): AuthUser | undefined {
  const cleanEmail = email.trim().toLowerCase();
  return dbCache.users.find((u) => u.email.toLowerCase() === cleanEmail);
}

export function findUserById(id: string): AuthUser | undefined {
  return dbCache.users.find((u) => u.id === id);
}

export function createUser(userData: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: 'customer' | 'seller' | 'admin';
  email_verified?: boolean;
  auth_provider?: 'local' | 'google' | 'facebook';
}): AuthUser {
  const cleanEmail = userData.email.trim().toLowerCase();
  const { salt, hash } = userData.password
    ? hashPassword(userData.password)
    : { salt: '', hash: '' };

  const newUser: AuthUser = {
    id: 'usr_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
    name: userData.name.trim(),
    email: cleanEmail,
    phone: userData.phone || '',
    role: userData.role || 'customer',
    email_verified: Boolean(userData.email_verified),
    salt,
    password_hash: hash,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    auth_provider: userData.auth_provider || 'local'
  };

  dbCache.users.push(newUser);
  persistDb();
  return newUser;
}

export function updateUser(id: string, updates: Partial<AuthUser>): AuthUser | null {
  const index = dbCache.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  dbCache.users[index] = {
    ...dbCache.users[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  persistDb();
  return dbCache.users[index];
}

// OTP methods
export function createAndStoreOTP(
  email: string,
  purpose: 'signup' | 'login' | 'reset_password'
): { code: string; cooldownRemaining?: number } {
  const cleanEmail = email.trim().toLowerCase();
  const key = `${cleanEmail}_${purpose}`;
  const now = Date.now();

  const existing = dbCache.otps[key];
  if (existing && existing.last_sent_at) {
    const elapsed = (now - existing.last_sent_at) / 1000;
    if (elapsed < 60) {
      return { code: '', cooldownRemaining: Math.ceil(60 - elapsed) };
    }
  }

  const code = generateRandomOTP();
  const otpHash = hashOTP(code);

  dbCache.otps[key] = {
    email: cleanEmail,
    otp_hash: otpHash,
    purpose,
    expires_at: now + 5 * 60 * 1000, // 5 minutes validity as requested
    attempts: 0,
    last_sent_at: now,
    created_at: new Date().toISOString(),
    used: false
  };

  persistDb();
  return { code };
}

export function verifyOTP(
  email: string,
  code: string,
  purpose: 'signup' | 'login' | 'reset_password'
): { valid: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const key = `${cleanEmail}_${purpose}`;
  const record = dbCache.otps[key];

  if (!record) {
    return { valid: false, error: 'No verification code requested for this email. Please request a new code.' };
  }

  if (record.used) {
    return { valid: false, error: 'This verification code has already been used. Please request a new code.' };
  }

  if (Date.now() > record.expires_at) {
    return { valid: false, error: 'This verification code has expired (valid for 5 minutes). Please request a new code.' };
  }

  if (record.attempts >= 5) {
    return { valid: false, error: 'Too many incorrect attempts. Please request a new verification code.' };
  }

  const inputHash = hashOTP(code);
  if (inputHash !== record.otp_hash) {
    record.attempts += 1;
    persistDb();
    const remainingAttempts = 5 - record.attempts;
    return {
      valid: false,
      error: `Invalid verification code. Please try again. (${remainingAttempts} attempts remaining)`
    };
  }

  // Code is valid! Mark as used immediately so it cannot be reused
  record.used = true;
  record.used_at = new Date().toISOString();
  persistDb();

  return { valid: true };
}

// Reset Token methods
export function createResetToken(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  dbCache.reset_tokens[cleanEmail] = {
    email: cleanEmail,
    token,
    expires_at: now + 15 * 60 * 1000, // 15 minutes
    used: false,
    created_at: new Date().toISOString()
  };

  persistDb();
  return token;
}

export function verifyAndConsumeResetToken(email: string, token: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const record = dbCache.reset_tokens[cleanEmail];
  if (!record) return false;
  if (record.used || Date.now() > record.expires_at) return false;
  if (record.token !== token) return false;

  record.used = true;
  persistDb();
  return true;
}

// Session methods
export function createSession(user: AuthUser): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  dbCache.sessions[token] = {
    token,
    user_id: user.id,
    email: user.email,
    role: user.role,
    created_at: new Date().toISOString(),
    expires_at: now + 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  // Update last_login
  user.last_login = new Date().toISOString();
  persistDb();

  return token;
}

export function getSession(token: string): UserSession | null {
  if (!token) return null;
  const session = dbCache.sessions[token];
  if (!session) return null;
  if (Date.now() > session.expires_at) {
    delete dbCache.sessions[token];
    persistDb();
    return null;
  }
  return session;
}

export function destroySession(token: string): void {
  if (token && dbCache.sessions[token]) {
    delete dbCache.sessions[token];
    persistDb();
  }
}

// Email notification content generator (engineered for Gmail Primary Inbox deliverability)
export function buildOTPEmailHTML(params: {
  name?: string;
  code: string;
  purposeTitle: string;
  purposeDescription: string;
}): string {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${params.code} is your ShopNexa verification code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Gmail Inbox Preview Snippet (Preheader) -->
  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${params.code} is your ShopNexa security verification code. Enter this code to verify your account.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 24px 32px; background-color: #ea580c; text-align: center;">
              <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Shop<span style="color: #fed7aa;">Nexa</span></span>
              <span style="display: block; font-size: 11px; color: #ffedd5; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 3px;">Account Security</span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <h1 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #0f172a; text-align: center;">
                ${params.purposeTitle}
              </h1>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
                ${params.name ? `Hello <strong>${params.name}</strong>,<br>` : ''}
                ${params.purposeDescription}
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
                <tr>
                  <td align="center" style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 18px 24px;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #9a3412; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      Verification Code
                    </span>
                    <span style="display: block; font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #ea580c; font-family: Consolas, 'Courier New', monospace;">
                      ${params.code}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Expiry & Safety Notice -->
              <p style="margin: 16px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b; text-align: center;">
                This code expires in 5 minutes. Please do not share this code with anyone. ShopNexa will never ask for your code over phone or chat.
              </p>
            </td>
          </tr>

          <!-- Footer & CAN-SPAM Compliance -->
          <tr>
            <td style="padding: 20px 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6;">
              ShopNexa eCommerce Ltd. &bull; Gulshan, Dhaka, Bangladesh<br>
              This is an automated transactional security message. If you did not make this request, you can safely disregard this email.<br>
              &copy; ${currentYear} ShopNexa. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
