import { Router } from "express";

import Property360RequestController
    from "../../controllers/buyer/property-360-request.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BUYER 360° REQUEST ROUTES
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/buyer/360-requests
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| REQUEST ACCESS
|--------------------------------------------------------------------------
*/

router.post(
    "/:propertyId",
    // verifyJWT,
    // requireBuyer,
    Property360RequestController.requestAccess
);


/*
|--------------------------------------------------------------------------
| MY REQUESTS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    Property360RequestController.getMyRequests
);


/*
|--------------------------------------------------------------------------
| ACCESS APPROVED 360° VIEW
|--------------------------------------------------------------------------
*/

router.get(
    "/:propertyId/view",
    // verifyJWT,
    // requireBuyer,
    Property360RequestController.getApprovedView
);

export default router;