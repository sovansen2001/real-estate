import express from "express";
import PropertyImageController from "../../controllers/seller/property-image.controller.js";
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Upload Property Images
|--------------------------------------------------------------------------
*/

router.post(
    "/:propertyId/images",
    upload.array("images", 15),
    PropertyImageController.uploadImages
);

/*
|--------------------------------------------------------------------------
| Delete Property Image
|--------------------------------------------------------------------------
*/

router.delete(
    "/:propertyId/images/:imageId",
    PropertyImageController.deleteImage
);

/*
|--------------------------------------------------------------------------
| Set Primary Image
|--------------------------------------------------------------------------
*/

router.patch(
    "/:propertyId/images/:imageId/primary",
    PropertyImageController.setPrimaryImage
);

/*
|--------------------------------------------------------------------------
| Reorder Property Images
|--------------------------------------------------------------------------
*/

router.patch(
    "/:propertyId/images/reorder",
    PropertyImageController.reorderImages
);

export default router;