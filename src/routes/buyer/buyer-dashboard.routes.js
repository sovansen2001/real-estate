import { Router } from "express";

import BuyerDashboardController from "../../controllers/buyer/buyer-dashboard.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BUYER DASHBOARD ROUTES
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/buyer/dashboard
|
| Authentication middleware will be added using your
| senior's existing authentication system.
|
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    BuyerDashboardController.getDashboard
);

export default router;