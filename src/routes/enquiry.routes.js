import express from "express";
import EnquiryController from "../controllers/enquiry.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
    createEnquirySchema
} from "../validators/enquiry.validator.js";
const router = express.Router();

/*
|--------------------------------------------------------------------------
| Enquiry Routes
|--------------------------------------------------------------------------
|
| Public:
|   POST /api/v1/enquiries
|
| Seller:
|   GET   /api/v1/enquiries
|   GET   /api/v1/enquiries/:enquiryId
|   PATCH /api/v1/enquiries/:enquiryId/status
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Create Enquiry
|--------------------------------------------------------------------------
|
| Authentication is optional.
| A visitor can submit an enquiry without logging in.
|
|--------------------------------------------------------------------------
*/
router.post(
    "/",
    validate(createEnquirySchema),
    EnquiryController.createEnquiry
);

/*
|--------------------------------------------------------------------------
| Seller Enquiries
|--------------------------------------------------------------------------
*/
router.get(
    "/",
    verifyJWT,
    authorizeRoles("seller"),
    EnquiryController.getSellerEnquiries
);

/*
|--------------------------------------------------------------------------
| Seller Enquiry Details
|--------------------------------------------------------------------------
*/
router.get(
    "/:enquiryId",
    verifyJWT,
    authorizeRoles("seller"),
    EnquiryController.getEnquiryById
);

/*
|--------------------------------------------------------------------------
| Update Enquiry Status
|--------------------------------------------------------------------------
*/
router.patch(
    "/:enquiryId/status",
    verifyJWT,
    authorizeRoles("seller"),
    EnquiryController.updateEnquiryStatus
);
export default router;