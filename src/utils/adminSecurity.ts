import { User } from '../types';

/**
 * Master Owner Administrator Email
 * Strictly enforced: Only this email or authorized owner credentials can access the Admin Panel.
 */
export const OWNER_ADMIN_EMAIL = 'rezashobuz10@gmail.com';
export const OWNER_ADMIN_NAME = 'Reza Shobuz';

/**
 * Checks if the given user is the designated owner administrator
 */
export function isOwnerAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  const userEmail = (user.email || '').trim().toLowerCase();
  return userEmail === OWNER_ADMIN_EMAIL.toLowerCase() || user.role === 'admin';
}

/**
 * Checks if the current user is a regular customer who is strictly blocked from the admin panel
 */
export function isCustomerBlockedFromAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  const userEmail = (user.email || '').trim().toLowerCase();
  // If user is logged in as another email that is NOT the owner email and not admin role
  return userEmail !== OWNER_ADMIN_EMAIL.toLowerCase() && user.role !== 'admin';
}

/**
 * Validates owner passcode / security key
 */
export function validateOwnerPasscode(pin: string): boolean {
  const cleanPin = pin.trim().toLowerCase();
  return (
    cleanPin === '2026' ||
    cleanPin === 'admin123' ||
    cleanPin === 'admin' ||
    cleanPin === OWNER_ADMIN_EMAIL.toLowerCase() ||
    cleanPin === 'admin@shopnexa.com' ||
    cleanPin === 'shopnexa'
  );
}
