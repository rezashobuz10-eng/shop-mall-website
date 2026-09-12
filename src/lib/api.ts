/**
 * Safe API request utility for ShopNexa
 * Handles API requests with automatic retry for transient network/proxy issues,
 * credentials inclusion for iframe compatibility, and clear, user-friendly error messages.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
  isConnectionError?: boolean;
  [key: string]: any;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit,
  retries: number = 2
): Promise<ApiResponse<T>> {
  try {
    const fetchOptions: RequestInit = {
      credentials: 'include',
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {})
      }
    };

    const res = await fetch(url, fetchOptions);
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
    // Retry with progressive backoff before returning an error to absorb cold-starts
    if (retries > 0 && (res.status === 404 || res.status >= 500)) {
      const delay = (3 - retries) * 400; // 400ms, then 800ms
      await new Promise((r) => setTimeout(r, delay));
      return safeFetchJson<T>(url, options, retries - 1);
    }

    // Friendly, domain-specific error messages
    let friendlyMessage = 'Unable to sign in right now. Please try again.';
    if (res.status === 401) {
      friendlyMessage = 'Email or password is incorrect.';
    } else if (res.status === 403) {
      friendlyMessage = 'Please verify your email before logging in.';
    } else if (res.status === 429) {
      friendlyMessage = 'Too many requests. Please wait a few seconds before trying again.';
    } else if (res.status === 404) {
      friendlyMessage = 'Service is initializing. Please click again to continue.';
    } else if (res.status >= 500) {
      friendlyMessage = 'Unable to complete request right now. Please try again.';
    }

    return {
      success: false,
      status: res.status,
      isConnectionError: res.status === 404 || res.status >= 500,
      error: friendlyMessage
    };
  } catch (err: any) {
    // Retry once on network drops
    if (retries > 0) {
      const delay = (3 - retries) * 400;
      await new Promise((r) => setTimeout(r, delay));
      return safeFetchJson<T>(url, options, retries - 1);
    }

    return {
      success: false,
      status: 0,
      isConnectionError: true,
      error: 'Connection problem. Please check your internet connection and try again.'
    };
  }
}

