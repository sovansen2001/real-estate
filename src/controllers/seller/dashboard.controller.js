import DashboardService from "../../services/dashboard.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| Seller Dashboard Controller
|--------------------------------------------------------------------------
| Handles Seller Dashboard APIs.
|--------------------------------------------------------------------------
*/

class DashboardController {

    /*
    |--------------------------------------------------------------------------
    | Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    async getDashboard(req, res, next) {

        try {

            /*
            --------------------------------------------------------------
            | Authentication will provide req.user._id later.
            | For now use a temporary sellerId while testing.
            --------------------------------------------------------------
            */

            const sellerId = req.user?._id;

            const dashboard = await DashboardService.getDashboardStats(
                sellerId
            );

            return res.status(200).json(

                new ApiResponse(
                    200,
                    dashboard,
                    "Dashboard fetched successfully."
                )

            );

        } catch (error) {

            next(error);

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Recent Properties
    |--------------------------------------------------------------------------
    */

    async getRecentProperties(req, res, next) {

        try {

            const sellerId = req.user?._id;

            const properties =
                await DashboardService.getRecentProperties(
                    sellerId
                );

            return res.status(200).json(

                new ApiResponse(
                    200,
                    properties,
                    "Recent properties fetched successfully."
                )

            );

        } catch (error) {

            next(error);

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Top Viewed Properties
    |--------------------------------------------------------------------------
    */

    async getTopViewedProperties(req, res, next) {

        try {

            const sellerId = req.user?._id;

            const properties =
                await DashboardService.getTopViewedProperties(
                    sellerId
                );

            return res.status(200).json(

                new ApiResponse(
                    200,
                    properties,
                    "Top viewed properties fetched successfully."
                )

            );

        } catch (error) {

            next(error);

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Monthly Statistics
    |--------------------------------------------------------------------------
    */

    async getMonthlyStatistics(req, res, next) {

        try {

            const sellerId = req.user?._id;

            const statistics =
                await DashboardService.getMonthlyStatistics(
                    sellerId
                );

            return res.status(200).json(

                new ApiResponse(
                    200,
                    statistics,
                    "Monthly statistics fetched successfully."
                )

            );

        } catch (error) {

            next(error);

        }

    }

}

export default new DashboardController();