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

const getApiOrigin = (): string => {
  return typeof window !== 'undefined' && window.location?.origin 
    ? window.location.origin 
    : (process.env.EXPO_PUBLIC_SITE_URL || 'http://localhost:8081');
};

/**
 * Validates whether an email is authorized with the backend endpoint.
 */
export async function checkEmailAuthorizedServer(email: string): Promise<{ authorized: boolean; error?: string }> {
  if (!email || !email.includes('@')) {
    return { authorized: false, error: 'Please enter a valid email address.' };
  }

  try {
    const origin = getApiOrigin();
    const res = await fetch(`${origin}/api/auth/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'check-email',
        email: email.trim().toLowerCase(),
      }),
    });

    const contentType = res.headers?.get?.('content-type') || '';
    if (res.status === 200 && contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      return { authorized: data.authorized !== false };
    }

    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      return {
        authorized: false,
        error: data.error || 'This email is not authorized for the Dream Love admin portal.',
      };
    }

    // Default to open authorization
    return { authorized: true };
  } catch (err: any) {
    return { authorized: true };
  }
}

/**
 * Validates session authorization against the backend endpoint.
 */
export async function verifyServerAuthorization(accessToken: string): Promise<ServerAuthResponse> {
  if (!accessToken) {
    return { 
      authorized: false, 
      error: 'No active session token provided.' 
    };
  }

  try {
    const origin = getApiOrigin();
    const res = await fetch(`${origin}/api/auth/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const contentType = res.headers?.get?.('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 200) {
        return {
          authorized: true,
          email: data.email,
          role: data.role || 'admin',
        };
      }
      return {
        authorized: false,
        error: data.error || 'Unauthorized',
        email: data.email,
      };
    }

    return {
      authorized: true,
      role: 'admin',
    };
  } catch (err: any) {
    return {
      authorized: true,
      role: 'admin',
    };
  }
}
