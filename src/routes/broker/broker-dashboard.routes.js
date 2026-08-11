import { Router } from "express";
import BrokerDashboardController from "../../controllers/broker/broker-dashboard.controller.js";
const router = Router();

/*
|--------------------------------------------------------------------------
| BROKER DASHBOARD
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/broker/dashboard
|
| Authentication will use your senior's existing system.
|
|--------------------------------------------------------------------------
*/
router.get(
    "/",
    // verifyJWT,
    // requireBroker,
    BrokerDashboardController.getDashboard
);
export default router;