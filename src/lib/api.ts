/**
 * Safe API request utility for ShopNexa
 * Handles API requests with automatic retry for transient network/proxy issues,
 * strict JSON parsing, and clear, user-friendly error messages.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
  [key: string]: any;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  retries: number = 1
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // If server responded with JSON
    if (contentType.includes('application/json')) {
      try {
        const json = await res.json();
        const isSuccess = res.ok && json.success !== false;
        
        let errorMsg = json.error || json.message;
        if (!isSuccess && !errorMsg) {
          if (res.status === 401) {
            errorMsg = 'Email or password is incorrect.';
          } else if (res.status === 403) {
            errorMsg = 'Please verify your email before logging in.';
          } else if (res.status >= 500) {
            errorMsg = 'Unable to sign in right now. Please try again.';
          } else {
            errorMsg = 'Unable to complete request. Please try again.';
          }
        }

        return {
          success: isSuccess,
          status: res.status,
          error: !isSuccess ? errorMsg : undefined,
          message: json.message,
          ...json
        };
      } catch {
        // Fall through to retry or friendly error if JSON parsing fails
      }
    }

    // If response was not valid JSON (e.g. gateway 502/503 or transient 404 during container wake-up)
    // Retry once before returning an error to absorb cold-starts
    if (retries > 0 && (res.status === 404 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 350));
      return safeFetchJson<T>(url, options, retries - 1);
    }

    // Friendly, domain-specific error messages per user instructions
    let friendlyMessage = 'Unable to sign in right now. Please try again.';
    if (res.status === 401) {
      friendlyMessage = 'Email or password is incorrect.';
    } else if (res.status === 403) {
      friendlyMessage = 'Please verify your email before logging in.';
    } else if (res.status === 429) {
      friendlyMessage = 'Too many requests. Please wait a few seconds before trying again.';
    } else if (res.status === 404) {
      friendlyMessage = 'Unable to connect to the authentication service right now. Please try again.';
    } else if (res.status >= 500) {
      friendlyMessage = 'Unable to sign in right now. Please try again.';
    }

    return {
      success: false,
      status: res.status,
      error: friendlyMessage
    };
  } catch (err: any) {
    // Retry once on network drops
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 350));
      return safeFetchJson<T>(url, options, retries - 1);
    }

    return {
      success: false,
      status: 0,
      error: 'Connection problem. Please check your internet connection and try again.'
    };
  }
}
