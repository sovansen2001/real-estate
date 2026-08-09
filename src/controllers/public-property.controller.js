import PublicPropertyService from "../services/public-property.service.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| PUBLIC PROPERTY CONTROLLER
|--------------------------------------------------------------------------
| Controller responsibilities:
|
| - Receive request
| - Pass data to service
| - Return API response
|
| No business logic belongs here.
|--------------------------------------------------------------------------
*/

class PublicPropertyController {

    /*
    |--------------------------------------------------------------------------
    | FEATURED PROPERTIES
    |--------------------------------------------------------------------------
    */

    getFeaturedProperties = asyncHandler(
        async (req, res) => {

            const properties =
                await PublicPropertyService
                    .getFeaturedProperties(
                        req.query.limit
                    );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    properties,
                    "Featured properties fetched successfully."
                )
            );
        }
    );

    /*
    |--------------------------------------------------------------------------
    | LATEST PROPERTIES
    |--------------------------------------------------------------------------
    */

    getLatestProperties = asyncHandler(
        async (req, res) => {

            const properties =
                await PublicPropertyService
                    .getLatestProperties(
                        req.query.limit
                    );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    properties,
                    "Latest properties fetched successfully."
                )
            );
        }
    );

    /*
    |--------------------------------------------------------------------------
    | SEARCH / FILTER
    |--------------------------------------------------------------------------
    */

    searchProperties = asyncHandler(
        async (req, res) => {

            const result =
                await PublicPropertyService
                    .searchProperties(
                        req.query
                    );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Properties fetched successfully."
                )
            );
        }
    );

    /*
    |--------------------------------------------------------------------------
    | PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */

    getPropertyDetails = asyncHandler(
        async (req, res) => {

            const property =
                await PublicPropertyService
                    .getPropertyDetails(
                        req.params.propertyId
                    );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    property,
                    "Property details fetched successfully."
                )
            );
        }
    );
}

export default new PublicPropertyController();