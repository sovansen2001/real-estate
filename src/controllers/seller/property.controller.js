import PropertyService from "../services/property.service.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| Property Controller
|--------------------------------------------------------------------------
|
| Responsibilities
| ----------------
| ✔ Receive Request
| ✔ Call Service Layer
| ✔ Return Standard API Response
|
| NOTE:
| -----
| No business logic should be written here.
|
|--------------------------------------------------------------------------
*/

class PropertyController {

    /*
    |--------------------------------------------------------------------------
    | Create Property
    |--------------------------------------------------------------------------
    */

    createProperty = asyncHandler(async (req, res) => {

        const property = await PropertyService.createProperty(

            req.user._id,

            req.body

        );

        return res.status(201).json(

            new ApiResponse(

                201,

                property,

                "Property created successfully."

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Get Seller Properties
    |--------------------------------------------------------------------------
    */

    getSellerProperties = asyncHandler(async (req, res) => {

        const properties = await PropertyService.getSellerProperties(

            req.user._id

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
    | Get Property By Id
    |--------------------------------------------------------------------------
    */

    getPropertyById = asyncHandler(async (req, res) => {

        const property = await PropertyService.getPropertyById(

            req.params.propertyId,

            req.user._id

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                property,

                "Property fetched successfully."

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Update Property
    |--------------------------------------------------------------------------
    */

    updateProperty = asyncHandler(async (req, res) => {

        const property = await PropertyService.updateProperty(

            req.params.propertyId,

            req.user._id,

            req.body

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                property,

                "Property updated successfully."

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Delete Property
    |--------------------------------------------------------------------------
    */

    deleteProperty = asyncHandler(async (req, res) => {

        await PropertyService.deleteProperty(

            req.params.propertyId,

            req.user._id

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                null,

                "Property deleted successfully."

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Submit Property For Approval
    |--------------------------------------------------------------------------
    */

    submitForApproval = asyncHandler(async (req, res) => {

        const property = await PropertyService.submitForApproval(

            req.params.propertyId,

            req.user._id

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                property,

                "Property submitted for approval."

            )

        );

    });

    /*
    |--------------------------------------------------------------------------
    | Seller Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    getDashboardStats = asyncHandler(async (req, res) => {

        const statistics = await PropertyService.getDashboardStats(

            req.user._id

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                statistics,

                "Dashboard statistics fetched successfully."

            )

        );

    });

}

export default new PropertyController();