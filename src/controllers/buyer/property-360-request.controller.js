import Property360RequestService
    from "../../services/buyer/property-360-request.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class Property360RequestController {

    /*
    |--------------------------------------------------------------------------
    | REQUEST 360° ACCESS
    |--------------------------------------------------------------------------
    */

    async requestAccess(req, res, next) {

        try {

            const buyerId = req.user._id;
            const { propertyId } = req.params;

            const request =
                await Property360RequestService.requestAccess(
                    buyerId,
                    propertyId
                );

            return res.status(201).json(
                new ApiResponse(
                    201,
                    request,
                    "360° view access requested successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | GET MY 360° REQUESTS
    |--------------------------------------------------------------------------
    */

    async getMyRequests(req, res, next) {

        try {

            const buyerId = req.user._id;

            const requests =
                await Property360RequestService.getMyRequests(
                    buyerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    requests,
                    "360° view requests fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | GET APPROVED 360° VIEW
    |--------------------------------------------------------------------------
    */

    async getApprovedView(req, res, next) {

        try {

            const buyerId = req.user._id;
            const { propertyId } = req.params;

            const tour =
                await Property360RequestService.getApprovedView(
                    buyerId,
                    propertyId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    tour,
                    "360° view fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new Property360RequestController();