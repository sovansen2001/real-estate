import RecentlyViewedService
    from "../../services/buyer/recently-viewed.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class RecentlyViewedController {

    async getRecentlyViewed(req, res, next) {

        try {

            const buyerId = req.user._id;

            const history =
                await RecentlyViewedService.getRecentlyViewed(
                    buyerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    history,
                    "Recently viewed properties fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }

    async clearRecentlyViewed(req, res, next) {

        try {

            const buyerId = req.user._id;

            await RecentlyViewedService.clearRecentlyViewed(
                buyerId
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    null,
                    "Recently viewed history cleared successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new RecentlyViewedController();