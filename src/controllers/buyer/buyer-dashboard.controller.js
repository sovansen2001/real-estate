import BuyerDashboardService from "../../services/buyer/buyer-dashboard.service.js";
import ApiResponse from "../../utils/api-response.js";

class BuyerDashboardController {

    /*
    |--------------------------------------------------------------------------
    | GET BUYER DASHBOARD
    |--------------------------------------------------------------------------
    */

    async getDashboard(req, res, next) {

        try {

            const buyerId = req.user._id;

            const dashboard =
                await BuyerDashboardService.getDashboard(
                    buyerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    dashboard,
                    "Buyer dashboard fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new BuyerDashboardController();