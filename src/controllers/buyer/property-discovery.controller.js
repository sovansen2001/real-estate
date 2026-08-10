import PropertyDiscoveryService from "../../services/buyer/property-discovery.service.js";
import ApiResponse from "../../utils/api-response.js";
class PropertyDiscoveryController {

    /*
    |--------------------------------------------------------------------------
    | GET PUBLICLY AVAILABLE PROPERTIES FOR BUYER
    |--------------------------------------------------------------------------
    */
    async getProperties(req, res, next) {
        try {
            const result =
                await PropertyDiscoveryService.getProperties(
                    req.query
                );
            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Properties fetched successfully."
                )
            );

        } catch (error) {
            next(error);
        }
    }
}

export default new PropertyDiscoveryController();