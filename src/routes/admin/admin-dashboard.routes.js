import { Router } from "express";

import AdminDashboardController from "../../controllers/admin/admin-dashboard.controller.js";

// Authentication middleware
// import { verifyJWT } from "../../middleware/auth.middleware.js";
// import { requireAdmin } from "../../middleware/admin.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD ROUTES
|--------------------------------------------------------------------------
|
| Base Route: /api/v1/admin/dashboard
|
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireAdmin,
    AdminDashboardController.getDashboard
);

export default router;
