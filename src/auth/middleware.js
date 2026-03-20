// src/auth/middleware.js
// CRITICAL PATH: Changes here require security review (Watchflow rule: severity critical)

/**
 * authenticate — verify JWT and attach user to request.
 * Used as Express middleware on protected routes.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  // Placeholder: real implementation would verify via jwt.verify()
  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = { id: 1, login: 'authenticated-user' };
  next();
}


/**
 * authorize — simple role-based access control.
 */
function authorize(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
