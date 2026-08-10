import { Router } from "express";
import PropertyDiscoveryController from "../../controllers/buyer/property-discovery.controller.js";
import PropertyDetailsController from "../../controllers/buyer/property-details.controller.js";
const router = Router();

/*
|--------------------------------------------------------------------------
| BUYER PROPERTY DISCOVERY
|--------------------------------------------------------------------------
*/
router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    PropertyDiscoveryController.getProperties
);

/*
|--------------------------------------------------------------------------
| BUYER PROPERTY DETAILS
|--------------------------------------------------------------------------
*/
router.get(
    "/:propertyId",
    // verifyJWT,
    // requireBuyer,
    PropertyDetailsController.getPropertyDetails
);
export default router;