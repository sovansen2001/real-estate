import { Router } from "express";

import SellerPropertyController from "../../controllers/seller/seller-property.controller.js";

// Authentication middleware
// import { verifySeller } from "../../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| SELLER PROPERTY ROUTES
|--------------------------------------------------------------------------
| Authentication will be enabled after the authentication
| module is completed.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL SELLER PROPERTIES
|--------------------------------------------------------------------------
|
| Query Parameters:
|
| page
| limit
| search
| approvalStatus
| listingStatus
| sort
|
*/
router.get(
    "/:sellerId",

    // verifySeller,

    SellerPropertyController.getSellerProperties
);

/*
|--------------------------------------------------------------------------
| GET PROPERTY STATISTICS
|--------------------------------------------------------------------------
*/
router.get(
    "/:sellerId/statistics",

    // verifySeller,

    SellerPropertyController.getSellerPropertyCounts
);

/*
|--------------------------------------------------------------------------
| GET SINGLE PROPERTY
|--------------------------------------------------------------------------
*/
router.get(
    "/:sellerId/:propertyId",

    // verifySeller,

    SellerPropertyController.getSellerPropertyById
);

export default router;