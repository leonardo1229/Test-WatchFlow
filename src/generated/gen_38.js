/**
 * gen_38.js — Generated: Error catalogue
 */

class AppError extends Error {
  constructor(message, code, status = 500, details = {}) {
    super(message);
    this.name    = this.constructor.name;
    this.code    = code;
    this.status  = status;
    this.details = details;
  }

  toJSON() {
    return { error: { code: this.code, message: this.message, status: this.status, details: this.details } };
  }
}

class ValidationError extends AppError {
  constructor(message, details = {}) { super(message, 'VALIDATION_ERROR', 422, details); }
}

class NotFoundError extends AppError {
  constructor(resource, id) { super(`${resource} not found: ${id}`, 'NOT_FOUND', 404, { resource, id }); }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(message, 'UNAUTHORIZED', 401); }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(message, 'FORBIDDEN', 403); }
}

class ConflictError extends AppError {
  constructor(message, details = {}) { super(message, 'CONFLICT', 409, details); }
}

class RateLimitError extends AppError {
  constructor(retryAfter) {
    super('Too many requests', 'RATE_LIMIT', 429, { retryAfter });
    this.retryAfter = retryAfter;
  }
}

function isAppError(err) { return err instanceof AppError; }

module.exports = {
  AppError, ValidationError, NotFoundError, UnauthorizedError,
  ForbiddenError, ConflictError, RateLimitError, isAppError,
};
