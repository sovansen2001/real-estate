import Joi from "joi";

export const createEnquirySchema = Joi.object({
    property: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.hex": "Invalid property id.",
            "string.length": "Invalid property id.",
            "any.required": "Property is required."
        }),
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.min": "Name must be at least 2 characters.",
            "string.max": "Name cannot exceed 100 characters.",
            "any.required": "Name is required."
        }),
    email: Joi.string()
        .trim()
        .email()
        .max(150)
        .required()
        .messages({
            "string.email": "Please provide a valid email address.",
            "any.required": "Email is required."
        }),
    phone: Joi.string()
        .trim()
        .pattern(/^[0-9+\-\s()]{7,20}$/)
        .required()
        .messages({
            "string.pattern.base": "Please provide a valid phone number.",
            "any.required": "Phone number is required."
        }),
    message: Joi.string()
        .trim()
        .max(1000)
        .allow("")
        .optional()
});