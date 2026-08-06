import { Router } from "express";

import DashboardController from "../controllers/seller/dashboard.controller.js";

// Authentication middleware
// import verifySeller from "../middleware/verify-seller.middleware.js";

const router = Router();
/*
|--------------------------------------------------------------------------
| Seller Dashboard Routes
|--------------------------------------------------------------------------
| NOTE:
| Authentication middleware will be enabled after
| the authentication module is completed.
|--------------------------------------------------------------------------
*/
// Dashboard Statistics
router.get(
    "/:sellerId",
    // verifySeller,
    DashboardController.getDashboard
);

// Recent Properties
router.get(
    "/:sellerId/recent-properties",
    // verifySeller,
    DashboardController.getRecentProperties
);

// Top Viewed Properties
router.get(
    "/:sellerId/top-properties",
    // verifySeller,
    DashboardController.getTopViewedProperties
);

// Monthly Statistics
router.get(
    "/:sellerId/monthly-statistics",
    // verifySeller,
    DashboardController.getMonthlyStatistics
);

export default router;