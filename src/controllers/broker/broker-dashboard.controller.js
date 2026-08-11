import BrokerDashboardService from "../../services/broker/broker-dashboard.service.js";
import ApiResponse from "../../utils/api-response.js";
class BrokerDashboardController {
    async getDashboard(req, res, next) {
        try {
            const brokerId = req.user._id;
            const dashboard =
                await BrokerDashboardService.getDashboard(
                    brokerId
                );
            return res.status(200).json(
                new ApiResponse(
                    200,
                    dashboard,
                    "Broker dashboard fetched successfully."
                )
            );
        } catch (error) {
            next(error);
        }
    }
}
export default new BrokerDashboardController();