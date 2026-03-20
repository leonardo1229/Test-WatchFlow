/**
 * gen_01.js — Generated: User model factory
 */

const { v4: uuidv4 } = require('uuid');

const DEFAULT_ROLE = 'viewer';
const VALID_ROLES = ['admin', 'editor', 'viewer'];

function createUser({ name, email, role = DEFAULT_ROLE, meta = {} } = {}) {
  if (!name || typeof name !== 'string') throw new TypeError('name is required');
  if (!email || typeof email !== 'string') throw new TypeError('email is required');
  if (!VALID_ROLES.includes(role)) throw new RangeError(`role must be one of: ${VALID_ROLES.join(', ')}`);
  return {
    id: uuidv4(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    role,
    meta,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function updateUser(user, patch) {
  const allowed = ['name', 'email', 'role', 'meta'];
  const updates = Object.fromEntries(Object.entries(patch).filter(([k]) => allowed.includes(k)));
  return { ...user, ...updates, updatedAt: new Date().toISOString() };
}

function isAdmin(user) { return user.role === 'admin'; }
function isEditor(user) { return user.role === 'editor'; }
function canWrite(user) { return user.role === 'admin' || user.role === 'editor'; }

function serializeUser(user) {
  const { meta: _meta, ...rest } = user;
  return rest;
}

module.exports = { createUser, updateUser, isAdmin, isEditor, canWrite, serializeUser, VALID_ROLES };
