import PublicPropertyService from "../services/public-property.service.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| Public Property Controller
|--------------------------------------------------------------------------
| Handles public property APIs.
| No authentication required.
|--------------------------------------------------------------------------
*/
class PublicPropertyController {

    /*
    |--------------------------------------------------------------------------
    | Get Featured Properties
    |--------------------------------------------------------------------------
    */
    getFeaturedProperties = asyncHandler(async (req, res) => {
        const properties =
            await PublicPropertyService.getFeaturedProperties();
        return res.status(200).json(
            new ApiResponse(
                200,
                properties,
                "Featured properties fetched successfully."
            )
        );

    });
    
    /*
   |--------------------------------------------------------------------------
   | Get Latest Properties
   |--------------------------------------------------------------------------
   */
    getLatestProperties = asyncHandler(async (req, res) => {
        const properties =
        await PublicPropertyService.getLatestProperties();
        return res.status(200).json(
            new ApiResponse(
                200,
                properties,
                "Latest properties fetched successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Search Properties
    |--------------------------------------------------------------------------
    */
    searchProperties = asyncHandler(async (req, res) => {
        const properties =
        await PublicPropertyService.searchProperties(
            req.query
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                properties,
                "Properties fetched successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Get Property Details
    |--------------------------------------------------------------------------
    */
    getPropertyDetails = asyncHandler(async (req, res) => {
        const property =
            await PublicPropertyService.getPropertyDetails(
                req.params.propertyId
            );
        return res.status(200).json(
            new ApiResponse(
                200,
                property,
                "Property details fetched successfully."
            )
        );
    });
}
export default new PublicPropertyController();