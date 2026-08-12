import Broker360ViewService
    from "../../services/broker/broker-360-view.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class Broker360ViewController {

    /*
    |--------------------------------------------------------------------------
    | SUBMIT / RESUBMIT 360° VIEW
    |--------------------------------------------------------------------------
    */

    async submit360View(req, res, next) {

        try {

            const brokerId = req.user._id;

            const {
                tourUrl
            } = req.body;

            const result =
                await Broker360ViewService.submit360View(
                    brokerId,
                    req.params.propertyId,
                    tourUrl
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "360° view submitted successfully for admin approval."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | GET BROKER 360° VIEWS
    |--------------------------------------------------------------------------
    */

    async getMy360Views(req, res, next) {

        try {

            const brokerId = req.user._id;

            const result =
                await Broker360ViewService.getMy360Views(
                    brokerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Broker 360° views fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new Broker360ViewController();