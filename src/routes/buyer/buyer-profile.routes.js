import { Router } from "express";

import BuyerProfileController
    from "../../controllers/buyer/buyer-profile.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BUYER PROFILE ROUTES
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/buyer/profile
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET MY PROFILE
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    BuyerProfileController.getMyProfile
);


/*
|--------------------------------------------------------------------------
| UPDATE MY PROFILE
|--------------------------------------------------------------------------
*/

router.patch(
    "/",
    // verifyJWT,
    // requireBuyer,
    BuyerProfileController.updateMyProfile
);

export default router;