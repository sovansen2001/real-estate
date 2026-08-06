import SellerPropertyService from "../../services/seller-property.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| SELLER PROPERTY CONTROLLER
|--------------------------------------------------------------------------
| Handles seller property requests.
|--------------------------------------------------------------------------
*/

class SellerPropertyController {

    /*
    |--------------------------------------------------------------------------
    | GET ALL SELLER PROPERTIES
    |--------------------------------------------------------------------------
    */

    async getSellerProperties(req, res, next) {

        try {

            // After authentication:
            // const sellerId = req.user._id;

            const { sellerId } = req.params;

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

            // After authentication:
            // const sellerId = req.user._id;

            const { sellerId, propertyId } = req.params;

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
    | GET PROPERTY COUNTS
    |--------------------------------------------------------------------------
    */

    async getSellerPropertyCounts(req, res, next) {

        try {

            // After authentication:
            // const sellerId = req.user._id;

            const { sellerId } = req.params;

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