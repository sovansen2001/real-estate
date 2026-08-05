/*
 * ============================================================
 * STANDARD API RESPONSE
 * ============================================================
 *
 * This helper provides a consistent response structure
 * for all successful API responses.
 *
 * Example:
 *
 * {
 *     "statusCode": 200,
 *     "success": true,
 *     "message": "Property created successfully.",
 *     "data": {
 *          ...
 *     }
 * }
 *
 * Usage:
 *
 * return res.status(200).json(
 *     new ApiResponse(
 *         200,
 *         property,
 *         "Property created successfully."
 *     )
 * );
 * ============================================================
 */

class ApiResponse {

    constructor(
        statusCode,
        data = null,
        message = "Success"
    ) {

        /*
        |--------------------------------------------------------------------------
        | HTTP STATUS CODE
        |--------------------------------------------------------------------------
        */
        this.statusCode = statusCode;

        /*
        |--------------------------------------------------------------------------
        | SUCCESS FLAG
        |--------------------------------------------------------------------------
        */
        this.success = true;

        /*
        |--------------------------------------------------------------------------
        | RESPONSE MESSAGE
        |--------------------------------------------------------------------------
        */
        this.message = message;

        /*
        |--------------------------------------------------------------------------
        | RESPONSE DATA
        |--------------------------------------------------------------------------
        */
        this.data = data;
    }

}
export default ApiResponse;