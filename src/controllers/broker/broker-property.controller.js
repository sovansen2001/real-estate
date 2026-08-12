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
    async updateMyProperty(req, res, next) {

    try {

        const brokerId = req.user._id;

        const result =
            await BrokerPropertyService.updateMyProperty(
                brokerId,
                req.params.propertyId,
                req.body
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Broker property updated successfully."
            )
        );

    } catch (error) {

        next(error);

    }
}
async deleteMyProperty(req, res, next) {

    try {

        const brokerId = req.user._id;

        await BrokerPropertyService.deleteMyProperty(
            brokerId,
            req.params.propertyId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Broker property deleted successfully."
            )
        );

    } catch (error) {

        next(error);

    }
}
async updateListingStatus(req, res, next) {

    try {

        const brokerId = req.user._id;

        const result =
            await BrokerPropertyService.updateListingStatus(
                brokerId,
                req.params.propertyId,
                req.body.listingStatus
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Property listing status updated successfully."
            )
        );

    } catch (error) {

        next(error);

    }
}
async submitForApproval(req, res, next) {

    try {

        const brokerId = req.user._id;

        const result =
            await BrokerPropertyService.submitForApproval(
                brokerId,
                req.params.propertyId
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Property submitted for admin approval."
            )
        );

    } catch (error) {

        next(error);

    }
}
}
export default new BrokerPropertyController();