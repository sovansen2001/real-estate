import { Router } from "express";

import BrokerEnquiryController
    from "../../controllers/broker/broker-enquiry.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BROKER ENQUIRIES
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/broker/enquiries
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET MY ENQUIRIES
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBroker,
    BrokerEnquiryController.getMyEnquiries
);


/*
|--------------------------------------------------------------------------
| GET ENQUIRY DETAILS
|--------------------------------------------------------------------------
*/

router.get(
    "/:enquiryId",
    // verifyJWT,
    // requireBroker,
    BrokerEnquiryController.getEnquiryById
);


/*
|--------------------------------------------------------------------------
| UPDATE ENQUIRY STATUS
|--------------------------------------------------------------------------
*/

router.patch(
    "/:enquiryId/status",
    // verifyJWT,
    // requireBroker,
    BrokerEnquiryController.updateEnquiryStatus
);

export default router;