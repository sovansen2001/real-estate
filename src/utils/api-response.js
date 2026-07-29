/*
 * ============================================================
 * STANDARD API RESPONSE
 * ============================================================
 *
 * All successful API responses can use the same structure.
 *
 * Example:
 *
 * {
 *     success: true,
 *     message: "Property created successfully",
 *     data: {}
 * }
 * ============================================================
 */

class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;

        this.success = true;

        this.message = message;

        this.data = data;
    }
}

export default ApiResponse;