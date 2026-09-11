/**
 * Safe API request utility for ShopNexa
 * Prevents "Unexpected token ..., is not valid JSON" errors by checking Content-Type
 * and handling non-JSON proxy/gateway responses (e.g., 502/503/cold-starts) gracefully.
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
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // If server responded with JSON
    if (contentType.includes('application/json')) {
      try {
        const json = await res.json();
        const isSuccess = res.ok && json.success !== false;
        return {
          success: isSuccess,
          status: res.status,
          error: !isSuccess ? (json.error || json.message || `Request failed (${res.status})`) : undefined,
          message: json.message,
          ...json
        };
      } catch {
        return {
          success: false,
          status: res.status,
          error: 'The server returned an unparseable response. Please retry in a moment.'
        };
      }
    }

    // Server returned HTML or plain text (e.g. Cloud Run 502/503 cold-start or proxy message)
    let friendlyMessage = 'The server is currently connecting or initializing. Please retry in a moment.';
    if (res.status === 404) {
      friendlyMessage = 'The requested endpoint was not found. Please refresh the page.';
    } else if (res.status === 429) {
      friendlyMessage = 'Too many requests. Please wait a few seconds before trying again.';
    } else if (res.status >= 500) {
      friendlyMessage = 'The server is temporarily busy or reconnecting. Please click again to retry.';
    }

    return {
      success: false,
      status: res.status,
      error: friendlyMessage
    };
  } catch (err: any) {
    return {
      success: false,
      status: 0,
      error: 'Network connection issue. Please check your internet connection or retry.'
    };
  }
}
