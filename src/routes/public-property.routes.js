import express from "express";
import PublicPropertyController from "../controllers/public-property.controller.js";
const router = express.Router();
/*
|--------------------------------------------------------------------------
| Public Property Routes
|--------------------------------------------------------------------------
| These APIs are accessible without authentication.
|--------------------------------------------------------------------------
*/
// Featured Properties
router.get(
    "/featured",
    PublicPropertyController.getFeaturedProperties
);
// Latest Properties
router.get(
    "/latest",
    PublicPropertyController.getLatestProperties
);
// Property Details
router.get(
    "/:propertyId",
    PublicPropertyController.getPropertyDetails
);
export default router;