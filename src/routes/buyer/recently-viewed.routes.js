import { Router } from "express";

import RecentlyViewedController
    from "../../controllers/buyer/recently-viewed.controller.js";

const router = Router();

router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    RecentlyViewedController.getRecentlyViewed
);

router.delete(
    "/",
    // verifyJWT,
    // requireBuyer,
    RecentlyViewedController.clearRecentlyViewed
);

export default router;