import express from "express";

import PropertyController from "../controllers/property.controller.js";
import validate from "../middleware/validate.middleware.js";
import { createPropertySchema, updatePropertySchema } from "../validators/property.validator.js";

// Temporary authentication middleware
// Replace these imports middleware later.
//import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Seller Property Routes
|--------------------------------------------------------------------------
|
| Base Route:
| /api/v1/seller/properties
|
|--------------------------------------------------------------------------
*/

// Create Property
router.post(
    "/",
    //verifyJWT,
    //authorizeRoles("seller"),
    validate(createPropertySchema),
    PropertyController.createProperty
);

// Get All Seller Properties
router.get(
    "/",
    verifyJWT,
    authorizeRoles("seller"),
    PropertyController.getSellerProperties
);

// Dashboard Statistics
router.get(
    "/dashboard",
    verifyJWT,
    authorizeRoles("seller"),
    PropertyController.getDashboardStats
);

// Get Single Property
router.get(
    "/:propertyId",
    verifyJWT,
    authorizeRoles("seller"),
    PropertyController.getPropertyById
);

// Update Property
router.patch(
    "/:propertyId",
    verifyJWT,
    authorizeRoles("seller"),
    validate(updatePropertySchema),
    PropertyController.updateProperty
);

// Delete Property
router.delete(
    "/:propertyId",
    verifyJWT,
    authorizeRoles("seller"),
    PropertyController.deleteProperty
);

// Submit Property For Approval
router.patch(
    "/:propertyId/submit",
    verifyJWT,
    authorizeRoles("seller"),
    PropertyController.submitForApproval
);

export default router;