import BrokerPropertyService from "../../services/broker/broker-property.service.js";
import ApiResponse from "../../utils/api-response.js";
class BrokerPropertyController {
    async getMyProperties(req, res, next) {
        try {
            const brokerId = req.user._id;
            const result =
                await BrokerPropertyService.getMyProperties(
                    brokerId,
                    req.query
                );
            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Broker properties fetched successfully."
                )
            );
        } catch (error) {
            next(error);

        }
    }
    async getMyPropertyById(req, res, next) {
        try {
            const brokerId = req.user._id;
            const result =
                await BrokerPropertyService.getMyPropertyById(
                    brokerId,
                    req.params.propertyId
                );
            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Broker property details fetched successfully."
                )
            );
        } catch (error) {
            next(error);
        }
    }
}
export default new BrokerPropertyController();