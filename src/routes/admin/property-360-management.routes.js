import { Router } from "express";

import Property360ManagementController
    from "../../controllers/admin/property-360-management.controller.js";

// Authentication middleware created by your senior
// import { verifyJWT } from "../../middleware/auth.middleware.js";
// import { requireAdmin } from "../../middleware/admin.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN 360° VIEW MANAGEMENT
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/admin/360-views
|
|--------------------------------------------------------------------------
*/

// Get all 360° views
router.get(
    "/",
    // verifyJWT,
    // requireAdmin,
    Property360ManagementController.getAll360Views
);

// Approve 360° view
router.patch(
    "/:viewId/approve",
    // verifyJWT,
    // requireAdmin,
    Property360ManagementController.approve360View
);

// Reject 360° view
router.patch(
    "/:viewId/reject",
    // verifyJWT,
    // requireAdmin,
    Property360ManagementController.reject360View
);

export default router;