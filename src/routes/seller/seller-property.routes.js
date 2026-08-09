import { Router } from "express";

import SellerPropertyController from "../../controllers/seller/seller-property.controller.js";

// Authentication middleware
// Use the authentication middleware created by your senior.
// Uncomment the correct middleware import when connecting it.
// import { verifySeller } from "../../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| SELLER PROPERTY ROUTES
|--------------------------------------------------------------------------
|
| These routes are for the authenticated seller.
|
| The seller ID is NOT taken from the URL.
| It must come from req.user._id after authentication.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET ALL SELLER PROPERTIES
|--------------------------------------------------------------------------
|
| Optional Query Parameters:
|
| page
| limit
| search
| approvalStatus
| listingStatus
| sort
|
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    // verifySeller,
    SellerPropertyController.getSellerProperties
);


/*
|--------------------------------------------------------------------------
| GET PROPERTY STATISTICS
|--------------------------------------------------------------------------
*/

router.get(
    "/statistics",
    // verifySeller,
    SellerPropertyController.getSellerPropertyCounts
);


/*
|--------------------------------------------------------------------------
| GET SINGLE SELLER PROPERTY
|--------------------------------------------------------------------------
*/

router.get(
    "/:propertyId",
    // verifySeller,
    SellerPropertyController.getSellerPropertyById
);


export default router;