import { Router } from "express";

import PropertyImageController from "../../controllers/seller/property-image.controller.js";

import upload from "../../middleware/upload.middleware.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| UPLOAD PROPERTY IMAGES
|--------------------------------------------------------------------------
|
| Method: POST
| Endpoint:
| /api/v1/seller/property/:propertyId/images
|
| Form-data field name: images
|
|--------------------------------------------------------------------------
*/

router.post(
    "/:propertyId/images",
    upload.array("images", 15),
    PropertyImageController.uploadImages
);


export default router;