import express from "express";
import rateLimit from "express-rate-limit";

import ContactController from "../controllers/contact.controller.js";

import validate from "../middleware/validate.middleware.js";

import {
    createContactSchema
} from "../validators/contact.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CONTACT SUBMISSION RATE LIMIT
|--------------------------------------------------------------------------
|
| Contact is a public endpoint.
|
| This prevents automated spam from repeatedly
| submitting contact forms.
|
|--------------------------------------------------------------------------
*/

const contactRateLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many contact requests. Please try again later."
    }
});

/*
|--------------------------------------------------------------------------
| CREATE CONTACT MESSAGE
|--------------------------------------------------------------------------
|
| POST /api/v1/contact
|
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    contactRateLimiter,
    validate(createContactSchema),
    ContactController.createContact
);

export default router;