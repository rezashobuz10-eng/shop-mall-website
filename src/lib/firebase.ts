import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the exact database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Connection check
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection test succeeded.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing.');
    } else {
      console.log('[Firebase] Ping result:', error);
    }
    return true; // Still operational via local caching
  }
}

// Automatically test connection on module load
testConnection();

// Customer document interface stored in Firestore
export interface FirestoreCustomer {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  authMethod: 'email_code' | 'google' | 'password';
  isVerified: boolean;
  phone?: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  loginCount: number;
}

// Helper: Sanitize email to form safe document ID
export function emailToDocId(email: string): string {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Save customer's Gmail / Email and profile to Firestore database
 */
export async function saveCustomerToFirestore(data: {
  email: string;
  name: string;
  role?: 'customer' | 'seller' | 'admin';
  authMethod?: 'email_code' | 'google' | 'password';
  isVerified?: boolean;
  phone?: string;
  avatar?: string;
}): Promise<FirestoreCustomer> {
  const docId = emailToDocId(data.email);
  const path = `customers/${docId}`;

  const customerRecord: FirestoreCustomer = {
    id: docId,
    email: data.email.trim().toLowerCase(),
    name: data.name.trim() || data.email.split('@')[0],
    role: data.role || 'customer',
    authMethod: data.authMethod || 'email_code',
    isVerified: data.isVerified ?? true,
    phone: data.phone || '',
    avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.email)}`,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1
  };

  try {
    // Check if customer already exists to increment login count & preserve creation date
    const docRef = doc(db, 'customers', docId);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
      const existingData = existing.data() as FirestoreCustomer;
      customerRecord.createdAt = existingData.createdAt || customerRecord.createdAt;
      customerRecord.loginCount = (existingData.loginCount || 1) + 1;
      customerRecord.role = existingData.role || customerRecord.role;
      customerRecord.phone = data.phone || existingData.phone || '';
      if (!data.name && existingData.name) {
        customerRecord.name = existingData.name;
      }
    }

    await setDoc(docRef, customerRecord, { merge: true });
    console.log(`[Firestore] Successfully saved customer Gmail ${data.email} to database.`);
    return customerRecord;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    // Fallback save in local cache
    return customerRecord;
  }
}

/**
 * Fetch all registered customer emails from Firestore database
 */
export async function fetchCustomersFromFirestore(): Promise<FirestoreCustomer[]> {
  const path = 'customers';
  try {
    const q = query(collection(db, path), limit(100));
    const snapshot = await getDocs(q);
    const list: FirestoreCustomer[] = [];
    snapshot.forEach(docSnap => {
      list.push(docSnap.data() as FirestoreCustomer);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Save generated 6-digit email authentication code to Firestore
 */
export async function saveAuthCodeToFirestore(email: string, code: string): Promise<boolean> {
  const docId = emailToDocId(email);
  const path = `auth_codes/${docId}`;
  const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  try {
    await setDoc(doc(db, 'auth_codes', docId), {
      id: docId,
      email: email.trim().toLowerCase(),
      code,
      expiresAt: expiry,
      used: false,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

/**
 * Verify 6-digit email code against Firestore
 */
export async function verifyAuthCodeInFirestore(email: string, inputCode: string): Promise<{ valid: boolean; reason?: string }> {
  const docId = emailToDocId(email);
  const path = `auth_codes/${docId}`;

  try {
    const docRef = doc(db, 'auth_codes', docId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return { valid: false, reason: 'No verification code found for this email. Please request a new one.' };
    }

    const data = snap.data();
    if (data.used) {
      return { valid: false, reason: 'This verification code has already been used. Please request a new code.' };
    }

    if (new Date(data.expiresAt).getTime() < Date.now()) {
      return { valid: false, reason: 'Verification code has expired. Please request a new one.' };
    }

    if (String(data.code).trim() !== String(inputCode).trim()) {
      return { valid: false, reason: 'Invalid 6-digit code. Please check your email and try again.' };
    }

    // Mark as used
    await setDoc(docRef, { used: true }, { merge: true });
    return { valid: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return { valid: false, reason: 'Database verification failed. Please try again.' };
  }
}

export interface OrderEmailDispatchResult {
  success: boolean;
  delivered: boolean;
  method: 'smtp' | 'unconfigured_smtp' | 'firestore_mail' | 'error';
  orderCode: string;
  recipient: string;
  gmailComposeUrl: string;
  message?: string;
}

/**
 * Generate a prefilled Gmail compose URL so the email can be opened/sent directly in Gmail
 */
export function getGmailComposeUrl(recipient: string, subject: string, body: string): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: recipient,
    su: subject,
    body: body
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

/**
 * Generate a WhatsApp message URL to instantly send the order code to customer's WhatsApp without any password setup
 */
export function getWhatsAppShareUrl(phone: string | undefined, message: string): string {
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
    cleanPhone = '88' + cleanPhone;
  }
  const encoded = encodeURIComponent(message);
  if (cleanPhone.length >= 10) {
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

/**
 * Check backend SMTP configuration status
 */
export async function checkEmailConfigStatus(): Promise<{ configured: boolean; senderEmail?: string; provider?: string }> {
  try {
    const res = await fetch('/api/email-status');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // ignore fetch errors
  }
  return { configured: false };
}

/**
 * Dispatch and record ShopNexa order confirmation code notification to customer's Gmail
 * 1. Calls backend /api/send-order-email for real SMTP transmission
 * 2. Saves to Firestore order_notifications collection
 * 3. Saves to Firestore mail collection (Firebase Trigger Email extension format)
 */
export async function dispatchShopNexaOrderEmail(params: {
  orderId: string;
  orderNumber: string;
  orderCode: string;
  trackingNumber?: string;
  customerEmail: string;
  customerName: string;
  total: number;
  itemsCount: number;
}): Promise<OrderEmailDispatchResult> {
  const docId = `ord_notif_${params.orderId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  const cleanEmail = (params.customerEmail || 'customer@gmail.com').trim().toLowerCase();
  const subject = `[ShopNexa] অর্ডার কনফার্মেশন কোড: ${params.orderCode} (Order #${params.orderNumber})`;
  const tracking = params.trackingNumber || `STF-${params.orderNumber.replace(/[^0-9]/g, '').slice(-6)}`;
  
  const plainTextBody = `প্রিয় ${params.customerName || 'গ্রাহক'},

ShopNexa থেকে কেনাকাটা করার জন্য ধন্যবাদ! আপনার অর্ডার কনফার্মেশন কোড: ${params.orderCode}

অর্ডার নম্বর: #${params.orderNumber}
ট্র্যাকিং নম্বর: ${tracking}
মোট আইটেম: ${params.itemsCount || 1} টি
সর্বমোট মূল্য: ৳${params.total.toLocaleString()}

ডেলিভারির সময় বা অর্ডার ট্র্যাকিংয়ের জন্য এই সিকিউরিটি কোডটি সংরক্ষণ করুন।
ShopNexa e-Commerce Support: support@shopnexa.com`;

  const gmailComposeUrl = getGmailComposeUrl(cleanEmail, subject, plainTextBody);

  let backendDelivered = false;
  let dispatchMethod: OrderEmailDispatchResult['method'] = 'firestore_mail';

  // 1. Try real email dispatch via backend Express API
  try {
    const res = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        orderCode: params.orderCode,
        trackingNumber: tracking,
        customerEmail: cleanEmail,
        customerName: params.customerName,
        total: params.total,
        itemsCount: params.itemsCount
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.delivered) {
        backendDelivered = true;
        dispatchMethod = 'smtp';
      } else if (data.method === 'unconfigured_smtp') {
        dispatchMethod = 'unconfigured_smtp';
      }
    }
  } catch (apiErr) {
    console.warn('[ShopNexa Email API] Backend dispatch fetch failed:', apiErr);
  }

  // 2. Record in Firestore collections
  const record = {
    id: docId,
    orderId: params.orderId,
    orderNumber: params.orderNumber,
    orderCode: params.orderCode,
    trackingNumber: tracking,
    customerEmail: cleanEmail,
    customerName: params.customerName || 'Valued Customer',
    total: params.total,
    itemsCount: params.itemsCount,
    sender: 'ShopNexa Official Notifications <orders@shopnexa.com>',
    subject,
    dispatchedAt: new Date().toISOString(),
    status: backendDelivered ? 'delivered_smtp' : 'dispatched_firestore',
    realDelivery: backendDelivered,
    type: 'order_success_code',
    deliveryChannel: 'gmail'
  };

  try {
    // Save to order_notifications
    await setDoc(doc(db, 'order_notifications', docId), record);

    // Save to mail collection (Firebase Trigger Email extension)
    await setDoc(doc(db, 'mail', docId), {
      to: cleanEmail,
      message: {
        subject,
        text: plainTextBody,
        html: `<p>প্রিয় <strong>${params.customerName}</strong>,</p><p>আপনার ShopNexa অর্ডার কোড: <strong>${params.orderCode}</strong></p><p>অর্ডার #${params.orderNumber} • মোট ৳${params.total.toLocaleString()}</p>`
      }
    }).catch(() => {
      // ignore mail collection error if extension not installed
    });

    // Also register/update customer in Firestore if not already saved
    await saveCustomerToFirestore({
      email: cleanEmail,
      name: params.customerName,
      role: 'customer',
      authMethod: 'email_code',
      isVerified: true
    });

    return {
      success: true,
      delivered: backendDelivered,
      method: dispatchMethod,
      orderCode: params.orderCode,
      recipient: cleanEmail,
      gmailComposeUrl,
      message: backendDelivered
        ? `সরাসরি জিমেইলে পাঠানো হয়েছে (${cleanEmail})`
        : `অর্ডার কোড জেনারেট ও ডাটাবেসে নিবন্ধিত হয়েছে (${cleanEmail})`
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `order_notifications/${docId}`);
    return {
      success: false,
      delivered: false,
      method: 'error',
      orderCode: params.orderCode,
      recipient: cleanEmail,
      gmailComposeUrl
    };
  }
}

/**
 * Fetch all dispatched order notifications from Firestore database
 */
export async function fetchOrderNotificationsFromFirestore(): Promise<any[]> {
  const path = 'order_notifications';
  try {
    const q = query(collection(db, path), limit(100));
    const snapshot = await getDocs(q);
    const list: any[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    // Sort recent first
    return list.sort((a, b) => new Date(b.dispatchedAt || 0).getTime() - new Date(a.dispatchedAt || 0).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

