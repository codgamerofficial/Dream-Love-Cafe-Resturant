/**
 * Server-Side Staff Authorization Endpoint
 * Vercel Serverless Function & Node.js HTTP Handler
 * 
 * Enforces server-side authorization against private AUTHORIZED_STAFF_EMAILS.
 * Never exposes the allowlist to client browser bundles.
 */
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // 1. Enable CORS for local development and preview deployments
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    // 2. Extract Authorization Bearer Token
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';

    if (!token) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ 
        authorized: false, 
        error: 'Missing authorization token' 
      }));
    }

    // 3. Initialize Supabase Auth Client
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ 
        authorized: false, 
        error: 'Server authentication configuration missing' 
      }));
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // 4. Authenticate JWT token securely with Supabase Auth
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user || !user.email) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ 
        authorized: false, 
        error: authErr?.message || 'Invalid or expired session' 
      }));
    }

    // 5. Server-side allowlist evaluation
    // Uses private server-side environment variable AUTHORIZED_STAFF_EMAILS
    const rawAllowedEmails = process.env.AUTHORIZED_STAFF_EMAILS || '';
    const allowedList = rawAllowedEmails
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const userEmail = user.email.trim().toLowerCase();
    const isAuthorized = allowedList.includes(userEmail);

    res.setHeader('Content-Type', 'application/json');

    if (!isAuthorized) {
      res.statusCode = 403;
      return res.end(JSON.stringify({
        authorized: false,
        error: "Admin access isn't available for this email address.",
        email: userEmail,
      }));
    }

    res.statusCode = 200;
    return res.end(JSON.stringify({
      authorized: true,
      email: userEmail,
      role: 'admin',
      user_id: user.id,
    }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      authorized: false,
      error: err.message || 'Internal server error during authorization verification'
    }));
  }
};
