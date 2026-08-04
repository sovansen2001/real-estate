import multer from "multer";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| Multer Error Handler
|--------------------------------------------------------------------------
|
| Converts Multer errors into user-friendly API errors.
|
|--------------------------------------------------------------------------
*/

const multerErrorHandler = (error, req, res, next) => {

    if (!(error instanceof multer.MulterError)) {
        return next(error);
    }

    switch (error.code) {

        case "LIMIT_FILE_SIZE":
            return next(
                new ApiError(
                    400,
                    "Each image must not exceed 5 MB."
                )
            );

        case "LIMIT_FILE_COUNT":
            return next(
                new ApiError(
                    400,
                    "Maximum 15 images are allowed."
                )
            );

        case "LIMIT_UNEXPECTED_FILE":
            return next(
                new ApiError(
                    400,
                    "Unexpected file field received."
                )
            );

        default:
            return next(
                new ApiError(
                    400,
                    "Image upload failed."
                )
            );

    }

};

export default multerErrorHandler;