/**
 * Staff Authorization Client Service
 * Enforces server-side authorization checks without exposing the allowlist to client bundles.
 */

export interface ServerAuthResponse {
  authorized: boolean;
  role?: string;
  email?: string;
  error?: string;
}

/**
 * Calls the server-side authorization endpoint with the user's JWT access token.
 * Validates against server-only AUTHORIZED_STAFF_EMAILS.
 */
export async function verifyServerAuthorization(accessToken: string): Promise<ServerAuthResponse> {
  if (!accessToken) {
    return { 
      authorized: false, 
      error: 'No active session token provided.' 
    };
  }

  try {
    const origin = typeof window !== 'undefined' && window.location?.origin 
      ? window.location.origin 
      : (process.env.EXPO_PUBLIC_SITE_URL || 'http://localhost:8081');

    const res = await fetch(`${origin}/api/auth/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      return {
        authorized: true,
        email: data.email,
        role: data.role || 'admin',
      };
    }

    if (res.status === 403) {
      const data = await res.json().catch(() => ({}));
      return {
        authorized: false,
        error: data.error || "Admin access isn't available for this email address.",
        email: data.email,
      };
    }

    // If endpoint returned 404 or other error (e.g. running under Metro bundler in dev)
    const errData = await res.json().catch(() => ({}));
    return {
      authorized: false,
      error: errData.error || "Admin access isn't available for this email address.",
    };
  } catch (err: any) {
    // Graceful fallback for local dev when backend endpoint is unreachable
    console.warn('Server-side auth check notice:', err.message);
    return {
      authorized: false,
      error: 'Authorization service is temporarily unreachable. Please try again.',
    };
  }
}
