import express from "express";

import PublicPropertyController
    from "../controllers/public-property.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC PROPERTY ROUTES
|--------------------------------------------------------------------------
|
| Base URL:
|
| /api/v1/properties
|
| No authentication required.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| FEATURED
|--------------------------------------------------------------------------
|
| GET /api/v1/properties/featured
|
| Optional:
| ?limit=8
|
|--------------------------------------------------------------------------
*/

router.get(
    "/featured",
    PublicPropertyController.getFeaturedProperties
);

/*
|--------------------------------------------------------------------------
| LATEST
|--------------------------------------------------------------------------
|
| GET /api/v1/properties/latest
|
| Optional:
| ?limit=12
|
|--------------------------------------------------------------------------
*/

router.get(
    "/latest",
    PublicPropertyController.getLatestProperties
);

/*
|--------------------------------------------------------------------------
| SEARCH / FILTER
|--------------------------------------------------------------------------
|
| GET /api/v1/properties/search
|
| Examples:
|
| ?listingType=sale
| ?listingType=rent
| ?propertyType=flat
| ?city=Hyderabad
| ?minPrice=5000000
| ?maxPrice=20000000
| ?bedrooms=3
| ?furnishing=fully
| ?page=1
| ?limit=12
| ?sort=price-low
|
|--------------------------------------------------------------------------
*/

router.get(
    "/search",
    PublicPropertyController.searchProperties
);

/*
|--------------------------------------------------------------------------
| PROPERTY DETAILS
|--------------------------------------------------------------------------
|
| GET /api/v1/properties/:propertyId
|
|--------------------------------------------------------------------------
*/

router.get(
    "/:propertyId",
    PublicPropertyController.getPropertyDetails
);

export default router;