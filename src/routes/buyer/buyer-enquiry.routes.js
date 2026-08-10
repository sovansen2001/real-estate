import { Router } from "express";

import BuyerEnquiryController
    from "../../controllers/buyer/buyer-enquiry.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BUYER ENQUIRY ROUTES
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/buyer/enquiries
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| CREATE ENQUIRY
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    // verifyJWT,
    // requireBuyer,
    BuyerEnquiryController.createEnquiry
);


/*
|--------------------------------------------------------------------------
| MY ENQUIRIES
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    BuyerEnquiryController.getMyEnquiries
);


/*
|--------------------------------------------------------------------------
| ENQUIRY DETAILS
|--------------------------------------------------------------------------
*/

router.get(
    "/:enquiryId",
    // verifyJWT,
    // requireBuyer,
    BuyerEnquiryController.getEnquiryById
);

export default router;