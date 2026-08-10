import { Router } from "express";

import Property360ViewController from "../controllers/property-360-view.controller.js";

// Authentication middleware created by your senior
// import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| SELLER 360° VIEW ROUTES
|--------------------------------------------------------------------------
|
| POST   /api/v1/properties/:propertyId/360-view
| GET    /api/v1/properties/:propertyId/360-view
| DELETE /api/v1/properties/:propertyId/360-view
|
|--------------------------------------------------------------------------
*/

// Submit 360° view
router.post(
    "/:propertyId/360-view",
    // verifyJWT,
    // authorizeRoles("Seller"),
    Property360ViewController.create360View
);

// Get seller's 360° view
router.get(
    "/:propertyId/360-view",
    // verifyJWT,
    // authorizeRoles("Seller"),
    Property360ViewController.getSeller360View
);

// Delete 360° view
router.delete(
    "/:propertyId/360-view",
    // verifyJWT,
    // authorizeRoles("Seller"),
    Property360ViewController.delete360View
);

export default router;