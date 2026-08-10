import PropertyDetailsService
    from "../../services/buyer/property-details.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class PropertyDetailsController {

    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */

    async getPropertyDetails(req, res, next) {

        try {

            const { propertyId } = req.params;

            // Authentication is handled by your senior's system.
            // Until it is connected, this can be null.
            const buyerId = req.user?._id ?? null;

            const property =
                await PropertyDetailsService.getPropertyDetails(
                    propertyId,
                    buyerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    property,
                    "Property details fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new PropertyDetailsController();