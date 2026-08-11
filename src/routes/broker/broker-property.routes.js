import { Router } from "express";
import SellerPropertyController from "../../controllers/seller/seller-property.controller.js";

const router = Router();
router.post(
    "/",
    // verifyJWT,
    // requireBroker,
    SellerPropertyController.createProperty
);

export default router;