import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| VALIDATION MIDDLEWARE
|--------------------------------------------------------------------------
| Purpose
| -------
| Validate request body, params and query using Zod schemas.
|--------------------------------------------------------------------------
*/
const validate = (schemas = {}) => {
    return async (req, res, next) => {
        try {

            /*
            |--------------------------------------------------------------------------
            | Validate Request Body
            |--------------------------------------------------------------------------
            */
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }

            /*
            |--------------------------------------------------------------------------
            | Validate URL Parameters
            |--------------------------------------------------------------------------
            */
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }

            /*
            |--------------------------------------------------------------------------
            | Validate Query Parameters
            |--------------------------------------------------------------------------
            */
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            next();
        } catch (error) {

            /*
            |--------------------------------------------------------------------------
            | Zod Validation Errors
            |--------------------------------------------------------------------------
            */
            if (error instanceof ZodError) {
                const validationErrors = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }));
                return next(
                    new ApiError(
                        400,
                        "Validation Failed",
                        validationErrors
                    )
                );
            }
            next(error);
        }
    };
};
export default validate;