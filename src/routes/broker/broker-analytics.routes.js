import { Router } from "express";

import BrokerAnalyticsController
    from "../../controllers/broker/broker-analytics.controller.js";

const router = Router();

router.get(
    "/",
    // verifyJWT,
    // requireBroker,
    BrokerAnalyticsController.getAnalytics
);

export default router;