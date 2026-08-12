import { Router } from "express";

import BrokerProfileController
    from "../../controllers/broker/broker-profile.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BROKER PROFILE
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/broker/profile
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBroker,
    BrokerProfileController.getProfile
);


/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

router.patch(
    "/",
    // verifyJWT,
    // requireBroker,
    BrokerProfileController.updateProfile
);

export default router;