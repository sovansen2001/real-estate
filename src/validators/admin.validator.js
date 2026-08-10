import { z } from "zod";

/*
|--------------------------------------------------------------------------
| ADMIN VALIDATORS
|--------------------------------------------------------------------------
*/

const ROLES = [
    "Buyer",
    "Seller",
    "Broker",
    "Admin"
];

/*
|--------------------------------------------------------------------------
| SET USER ACTIVE STATUS
|--------------------------------------------------------------------------
*/

export const setUserActiveStatusSchema = {
    body: z.object({
        isActive: z.boolean({
            required_error: "isActive is required.",
            invalid_type_error: "isActive must be true or false."
        })
    })
};


/*
|--------------------------------------------------------------------------
| CHANGE USER ROLE
|--------------------------------------------------------------------------
*/

export const changeUserRoleSchema = {
    body: z.object({
        role: z.enum(ROLES, {
            required_error: "role is required.",
            invalid_type_error: `role must be one of: ${ROLES.join(", ")}`
        })
    })
};


/*
|--------------------------------------------------------------------------
| REJECT PROPERTY
|--------------------------------------------------------------------------
*/

export const rejectPropertySchema = {
    body: z.object({
        reason: z
            .string({
                required_error: "A rejection reason is required."
            })
            .trim()
            .min(5, "Rejection reason must be at least 5 characters.")
            .max(500, "Rejection reason cannot exceed 500 characters.")
    })
};


/*
|--------------------------------------------------------------------------
| SET PROPERTY FEATURED
|--------------------------------------------------------------------------
*/

export const setFeaturedSchema = {
    body: z.object({
        isFeatured: z.boolean({
            required_error: "isFeatured is required.",
            invalid_type_error: "isFeatured must be true or false."
        })
    })
};
