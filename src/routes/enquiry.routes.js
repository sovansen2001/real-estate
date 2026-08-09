import express from "express";

import EnquiryController from "../controllers/enquiry.controller.js";

// Authentication middleware
// Uncomment these when connecting your senior's authentication middleware.
// import {
//     verifyJWT,
//     authorizeRoles
// } from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
    createEnquirySchema
} from "../validators/enquiry.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ENQUIRY ROUTES
|--------------------------------------------------------------------------
|
| Public:
| POST /api/v1/enquiries
|
| Seller:
| GET   /api/v1/enquiries
| GET   /api/v1/enquiries/:enquiryId
| PATCH /api/v1/enquiries/:enquiryId/status
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| CREATE ENQUIRY
|--------------------------------------------------------------------------
|
| Public endpoint.
| Login is optional.
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
| GET SELLER ENQUIRIES
|--------------------------------------------------------------------------
|
| Seller can see enquiries belonging to their own properties.
|
|--------------------------------------------------------------------------
*/

// router.get(
//     "/",
//     verifyJWT,
//     authorizeRoles("seller"),
//     EnquiryController.getSellerEnquiries
// );


/*
|--------------------------------------------------------------------------
| GET SINGLE ENQUIRY
|--------------------------------------------------------------------------
|
| Seller can only access an enquiry belonging
| to one of their properties.
|
|--------------------------------------------------------------------------
*/

// router.get(
//     "/:enquiryId",
//     verifyJWT,
//     authorizeRoles("seller"),
//     EnquiryController.getEnquiryById
// );


/*
|--------------------------------------------------------------------------
| UPDATE ENQUIRY STATUS
|--------------------------------------------------------------------------
|
| Seller can update:
|
| New
| Contacted
| In Progress
| Closed
|
|--------------------------------------------------------------------------
*/
// router.patch(
//     "/:enquiryId/status",
//     verifyJWT,
//     authorizeRoles("seller"),
//     EnquiryController.updateEnquiryStatus
// );
export default router;