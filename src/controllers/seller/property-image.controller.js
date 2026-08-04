import asyncHandler from "../../utils/async-handler.js";
import ApiResponse from "../../utils/api-response.js";
import PropertyImageService from "../../services/property-image.service.js";

/*
|--------------------------------------------------------------------------
| Property Image Controller
|--------------------------------------------------------------------------
|
| Handles incoming HTTP requests.
| Delegates business logic to PropertyImageService.
|
|--------------------------------------------------------------------------
*/
class PropertyImageController {

    /*
    |--------------------------------------------------------------------------
    | Upload Images
    |--------------------------------------------------------------------------
    */
    uploadImages = asyncHandler(async (req, res) => {
        const images = await PropertyImageService.uploadImages(
            req.params.propertyId,
            req.user._id,
            req.files
        );
        return res.status(201).json(
            new ApiResponse(
                201,
                images,
                "Images uploaded successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Delete Image
    |--------------------------------------------------------------------------
    */
    deleteImage = asyncHandler(async (req, res) => {
        const images = await PropertyImageService.deleteImage(
            req.params.propertyId,
            req.user._id,
            req.params.imageId
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                images,
                "Image deleted successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Set Primary Image
    |--------------------------------------------------------------------------
    */
    setPrimaryImage = asyncHandler(async (req, res) => {
        const images = await PropertyImageService.setPrimaryImage(
            req.params.propertyId,
            req.user._id,
            req.params.imageId
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                images,
                "Primary image updated successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Reorder Images
    |--------------------------------------------------------------------------
    */
    reorderImages = asyncHandler(async (req, res) => {
        const images = await PropertyImageService.reorderImages(
            req.params.propertyId,
            req.user._id,
            req.body.images
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                images,
                "Image order updated successfully."
            )
        );
    });
}
export default new PropertyImageController();