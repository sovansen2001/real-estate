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
| The seller ID is taken from req.user._id.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| CREATE SELLER PROPERTY
|--------------------------------------------------------------------------
|
| Method: POST
| Endpoint: /api/v1/seller/property
|
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    // verifySeller,
    SellerPropertyController.createProperty
);

/*
|--------------------------------------------------------------------------
| GET ALL SELLER PROPERTIES
|--------------------------------------------------------------------------
|
| Method: GET
| Endpoint: /api/v1/seller/property
|
| Optional Query Parameters:
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
|
| Method: GET
| Endpoint: /api/v1/seller/property/statistics
|
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
|
| Method: GET
| Endpoint: /api/v1/seller/property/:propertyId
|
|--------------------------------------------------------------------------
*/

router.get(
    "/:propertyId",
    // verifySeller,
    SellerPropertyController.getSellerPropertyById
);

/*
|--------------------------------------------------------------------------
| UPDATE SELLER PROPERTY
|--------------------------------------------------------------------------
|
| Method: PUT
| Endpoint: /api/v1/seller/property/:propertyId
|
|--------------------------------------------------------------------------
*/

router.put(
    "/:propertyId",
    // verifySeller,
    SellerPropertyController.updateProperty
);

/*
|--------------------------------------------------------------------------
| DELETE SELLER PROPERTY
|--------------------------------------------------------------------------
|
| Method: DELETE
| Endpoint: /api/v1/seller/property/:propertyId
|
|--------------------------------------------------------------------------
*/

router.delete(
    "/:propertyId",
    // verifySeller,
    SellerPropertyController.deleteProperty
);

/*
|--------------------------------------------------------------------------
| SUBMIT PROPERTY FOR APPROVAL
|--------------------------------------------------------------------------
|
| Method: PATCH
| Endpoint: /api/v1/seller/property/:propertyId/submit
|
|--------------------------------------------------------------------------
*/
router.patch(
    "/:propertyId/submit",
    // verifySeller,
    SellerPropertyController.submitForApproval
);

export default router;