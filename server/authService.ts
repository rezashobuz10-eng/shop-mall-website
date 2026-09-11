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

// In-memory cache for fast helper lookup
const latestCodeMap = new Map<string, string>();

export function getLatestOTP(email: string, purpose: 'signup' | 'login' | 'reset_password'): string | undefined {
  const cleanEmail = email.trim().toLowerCase();
  const key = `${cleanEmail}_${purpose}`;
  const inMem = latestCodeMap.get(key);
  if (inMem) return inMem;
  const record = dbCache.otps[key];
  if (record && !record.used && Date.now() < record.expires_at && record.plain_code) {
    return record.plain_code;
  }
  return undefined;
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
  latestCodeMap.set(key, code);

  dbCache.otps[key] = {
    email: cleanEmail,
    otp_hash: otpHash,
    plain_code: code,
    purpose,
    expires_at: now + 10 * 60 * 1000, // 10 minutes validity
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
    return { valid: false, error: 'This verification code has expired. Please request a new code.' };
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

  // Code is valid! Mark as used
  record.used = true;
  record.used_at = new Date().toISOString();
  delete record.plain_code;
  latestCodeMap.delete(key);
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

// Email notification content generator
export function buildOTPEmailHTML(params: {
  name?: string;
  code: string;
  purposeTitle: string;
  purposeDescription: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopNexa Security Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">Shop<span style="color: #fed7aa;">Nexa</span></span>
                    <span style="display: block; font-size: 11px; color: #ffedd5; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">Official Security Center</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 800; color: #0f172a; text-align: center;">
                ${params.purposeTitle}
              </h2>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
                ${params.name ? `Hello <strong>${params.name}</strong>,<br>` : ''}
                ${params.purposeDescription}
              </p>

              <!-- OTP Code Display Card -->
              <div style="background-color: #f1f5f9; border: 2px dashed #ea580c; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="display: block; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                  Your 6-Digit Verification Code
                </span>
                <span style="display: block; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace;">
                  ${params.code}
                </span>
              </div>

              <!-- Security Information -->
              <table role="presentation" width="100%" style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.6; color: #9a3412;">
                    ⏱️ <strong>Expires in 5 minutes:</strong> This code can only be used once.<br>
                    🔒 <strong>Keep it private:</strong> ShopNexa staff will never ask for your verification code.
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
                If you did not make this request on ShopNexa, please ignore this email. Your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
              &copy; ${new Date().getFullYear()} ShopNexa Bangladesh. All rights reserved.<br>
              Everything You Need, One Place.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
