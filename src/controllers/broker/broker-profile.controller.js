import BrokerProfileService
    from "../../services/broker/broker-profile.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class BrokerProfileController {

    /*
    |--------------------------------------------------------------------------
    | GET BROKER PROFILE
    |--------------------------------------------------------------------------
    */

    async getProfile(req, res, next) {

        try {

            const brokerId = req.user._id;

            const profile =
                await BrokerProfileService.getProfile(
                    brokerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    profile,
                    "Broker profile fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE BROKER PROFILE
    |--------------------------------------------------------------------------
    */

    async updateProfile(req, res, next) {

        try {

            const brokerId = req.user._id;

            const profile =
                await BrokerProfileService.updateProfile(
                    brokerId,
                    req.body
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    profile,
                    "Broker profile updated successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new BrokerProfileController();