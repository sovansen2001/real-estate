import { Router } from "express";

import Broker360ViewController
    from "../../controllers/broker/broker-360-view.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BROKER 360° VIEW
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/broker/360-view
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET MY 360° VIEWS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBroker,
    Broker360ViewController.getMy360Views
);


/*
|--------------------------------------------------------------------------
| SUBMIT / RESUBMIT 360° VIEW
|--------------------------------------------------------------------------
*/

router.post(
    "/:propertyId",
    // verifyJWT,
    // requireBroker,
    Broker360ViewController.submit360View
);

export default router;