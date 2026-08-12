import BrokerAnalyticsService
    from "../../services/broker/broker-analytics.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class BrokerAnalyticsController {

    async getAnalytics(req, res, next) {

        try {

            const brokerId = req.user._id;

            const result =
                await BrokerAnalyticsService.getAnalytics(
                    brokerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Broker analytics fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new BrokerAnalyticsController();