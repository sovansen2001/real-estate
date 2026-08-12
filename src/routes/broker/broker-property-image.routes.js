import { Router } from "express";
import PropertyImageController from "../../controllers/seller/property-image.controller.js";
const router = Router();

/*
|--------------------------------------------------------------------------
| BROKER PROPERTY IMAGES
|--------------------------------------------------------------------------
*/
/*
| Upload image
*/
router.post(
    "/:propertyId/images",
    // verifyJWT,
    // requireBroker,
    PropertyImageController.uploadImage
);

/*
| Delete image
*/
router.delete(
    "/:propertyId/images/:imageId",
    // verifyJWT,
    // requireBroker,
    PropertyImageController.deleteImage
);

export default router;