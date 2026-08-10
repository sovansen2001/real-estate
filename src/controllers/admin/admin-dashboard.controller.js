import AdminDashboardService from "../../services/admin/admin-dashboard.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD CONTROLLER
|--------------------------------------------------------------------------
*/

class AdminDashboardController {

    async getDashboard(req, res, next) {

        try {

            const overview = await AdminDashboardService.getDashboardOverview();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    overview,
                    "Admin dashboard fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new AdminDashboardController();
