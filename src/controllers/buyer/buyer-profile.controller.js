import BuyerProfileService
    from "../../services/buyer/buyer-profile.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class BuyerProfileController {

    /*
    |--------------------------------------------------------------------------
    | GET MY PROFILE
    |--------------------------------------------------------------------------
    */

    async getMyProfile(req, res, next) {

        try {

            const buyerId = req.user._id;

            const profile =
                await BuyerProfileService.getMyProfile(
                    buyerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    profile,
                    "Buyer profile fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE MY PROFILE
    |--------------------------------------------------------------------------
    */

    async updateMyProfile(req, res, next) {

        try {

            const buyerId = req.user._id;

            const profile =
                await BuyerProfileService.updateMyProfile(
                    buyerId,
                    req.body
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    profile,
                    "Buyer profile updated successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new BuyerProfileController();