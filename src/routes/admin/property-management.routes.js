import { Router } from "express";

import PropertyManagementController from "../../controllers/admin/property-management.controller.js";
import validate from "../../middleware/validate.middleware.js";
import {
    rejectPropertySchema,
    setFeaturedSchema
} from "../../validators/admin.validator.js";

// Authentication middleware
// import { verifyJWT } from "../../middleware/auth.middleware.js";
// import { requireAdmin } from "../../middleware/admin.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN PROPERTY MANAGEMENT ROUTES
|--------------------------------------------------------------------------
|
| Base Route: /api/v1/admin/properties
|
|--------------------------------------------------------------------------
*/

// Get All Properties
router.get(
    "/",
    // verifyJWT,
    // requireAdmin,
    PropertyManagementController.getAllProperties
);

// Property Statistics
router.get(
    "/statistics",
    // verifyJWT,
    // requireAdmin,
    PropertyManagementController.getPropertyStatistics
);

// Get Single Property
router.get(
    "/:propertyId",
    // verifyJWT,
    // requireAdmin,
    PropertyManagementController.getPropertyById
);

// Approve Property
router.patch(
    "/:propertyId/approve",
    // verifyJWT,
    // requireAdmin,
    PropertyManagementController.approveProperty
);

// Reject Property
router.patch(
    "/:propertyId/reject",
    // verifyJWT,
    // requireAdmin,
    validate(rejectPropertySchema),
    PropertyManagementController.rejectProperty
);

// Feature / Unfeature Property
router.patch(
    "/:propertyId/feature",
    // verifyJWT,
    // requireAdmin,
    validate(setFeaturedSchema),
    PropertyManagementController.setFeatured
);

// Delete Property
router.delete(
    "/:propertyId",
    // verifyJWT,
    // requireAdmin,
    PropertyManagementController.deleteProperty
);

export default router;
