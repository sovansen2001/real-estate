import SellerPropertyService from "../../services/seller-property.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| SELLER PROPERTY CONTROLLER
|--------------------------------------------------------------------------
|
| Handles seller property requests.
|
| Authentication:
| -------------
| The seller ID is taken from req.user._id.
|
| Business logic:
| ---------------
| All business logic remains inside SellerPropertyService.
|
|--------------------------------------------------------------------------
*/

class SellerPropertyController {

    /*
    |--------------------------------------------------------------------------
    | CREATE PROPERTY
    |--------------------------------------------------------------------------
    */

    async createProperty(req, res, next) {

        try {

            const sellerId = req.user._id;

            const property =
                await SellerPropertyService.createProperty(
                    sellerId,
                    req.body
                );

            return res.status(201).json(

                new ApiResponse(

                    201,

                    property,

                    "Property created successfully."

                )

            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET ALL SELLER PROPERTIES
    |--------------------------------------------------------------------------
    */

    async getSellerProperties(req, res, next) {

        try {

            const sellerId = req.user._id;

            const result =
                await SellerPropertyService.getSellerProperties(
                    sellerId,
                    req.query
                );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    result,

                    "Seller properties fetched successfully."

                )

            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET SINGLE PROPERTY
    |--------------------------------------------------------------------------
    */

    async getSellerPropertyById(req, res, next) {

        try {

            const sellerId = req.user._id;

            const propertyId = req.params.propertyId;

            const property =
                await SellerPropertyService.getSellerPropertyById(
                    sellerId,
                    propertyId
                );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    property,

                    "Property fetched successfully."

                )

            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE PROPERTY
    |--------------------------------------------------------------------------
    */

    async updateProperty(req, res, next) {

        try {

            const sellerId = req.user._id;

            const propertyId = req.params.propertyId;

            const property =
                await SellerPropertyService.updateProperty(
                    propertyId,
                    sellerId,
                    req.body
                );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    property,

                    "Property updated successfully."

                )

            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | DELETE PROPERTY
    |--------------------------------------------------------------------------
    */

    async deleteProperty(req, res, next) {

        try {

            const sellerId = req.user._id;

            const propertyId = req.params.propertyId;

            await SellerPropertyService.deleteProperty(
                propertyId,
                sellerId
            );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    null,

                    "Property deleted successfully."

                )

            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | SUBMIT PROPERTY FOR APPROVAL
    |--------------------------------------------------------------------------
    */

    async submitForApproval(req, res, next) {

        try {

            const sellerId = req.user._id;

            const propertyId = req.params.propertyId;

            const property =
                await SellerPropertyService.submitForApproval(
                    propertyId,
                    sellerId
                );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    property,

                    "Property submitted for approval."

                )

            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY STATISTICS
    |--------------------------------------------------------------------------
    */

    async getSellerPropertyCounts(req, res, next) {

        try {

            const sellerId = req.user._id;

            const counts =
                await SellerPropertyService.getSellerPropertyCounts(
                    sellerId
                );

            return res.status(200).json(

                new ApiResponse(

                    200,

                    counts,

                    "Property statistics fetched successfully."

                )

            );

        } catch (error) {

            next(error);

        }

    }

}

export default new SellerPropertyController();