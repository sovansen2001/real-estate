import { Router } from "express";
import BrokerPropertyController from "../../controllers/broker/broker-property.controller.js";
import SellerPropertyController from "../../controllers/seller/seller-property.controller.js";

const router = Router();
/*
|--------------------------------------------------------------------------
| ADD PROPERTY
|--------------------------------------------------------------------------
*/
router.post(
    "/",
    // verifyJWT,
    // requireBroker,
    SellerPropertyController.createProperty
);

/*
|--------------------------------------------------------------------------
| BROKER PROPERTY LIST
|--------------------------------------------------------------------------
*/
router.get(
    "/",
    // verifyJWT,
    // requireBroker,
    BrokerPropertyController.getMyProperties
);

/*
|--------------------------------------------------------------------------
| BROKER PROPERTY DETAILS
|--------------------------------------------------------------------------
*/
router.get(
    "/:propertyId",
    // verifyJWT,
    // requireBroker,
    BrokerPropertyController.getMyPropertyById
);
router.patch(
    "/:propertyId",
    // verifyJWT,
    // requireBroker,
    BrokerPropertyController.updateMyProperty
);
router.delete(
    "/:propertyId",
    // verifyJWT,
    // requireBroker,
    BrokerPropertyController.deleteMyProperty
);
router.patch(
    "/:propertyId/status",
    // verifyJWT,
    // requireBroker,
    BrokerPropertyController.updateListingStatus
);
router.patch(
    "/:propertyId/submit",
    // verifyJWT,
    // requireBroker,
    BrokerPropertyController.submitForApproval
);
export default router;