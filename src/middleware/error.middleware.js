import ApiError from "../utils/api-error.js";

/*
 * ============================================================
 * GLOBAL ERROR HANDLER
 * ============================================================
 *
 * Every unhandled controller/service error eventually comes
 * here.
 *
 * We avoid exposing stack traces or internal implementation
 * details to users in production.
 * ============================================================
 */

export const errorMiddleware = (
    error,
    req,
    res,
    next
) => {
    console.error(error);

    /*
     * Mongoose validation error
     */
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(
            (item) => item.message
        );

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    /*
     * Invalid MongoDB ObjectId
     */
    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid resource ID"
        });
    }

    /*
     * Duplicate MongoDB field.
     */
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists"
        });
    }

    /*
     * Multer upload error.
     */
    if (error.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: `Upload error: ${error.message}`
        });
    }

    /*
     * Our custom API error.
     */
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors
        });
    }

    /*
     * Do not expose internal errors to clients in production.
     */
    return res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : error.message
    });
};