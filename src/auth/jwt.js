// src/auth/jwt.js
// CRITICAL PATH: Changes here require security review (Watchflow rule: severity critical)

const SECRET = process.env.JWT_SECRET || 'change-me-in-production';

/**
 * sign — create a signed JWT payload (simplified, no real crypto here).
 */
function sign(payload, expiresInSeconds = 3600) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds })).toString('base64url');
  // NOTE: In production this would be HMAC-SHA256 signed. This is a stub for testing.
  const signature = Buffer.from(`${header}.${body}.${SECRET}`).toString('base64url');
  return `${header}.${body}.${signature}`;
}

/**
 * verify — decode and validate a JWT (simplified stub).
 */
function verify(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }
  return payload;
}

module.exports = { sign, verify };
