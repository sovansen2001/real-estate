/*
 * ============================================================
 * CUSTOM API ERROR
 * ============================================================
 *
 * Instead of creating random error objects throughout the
 * application, we use one standard error class.
 * ============================================================
 */

class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);

        this.statusCode = statusCode;

        this.errors = errors;

        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;