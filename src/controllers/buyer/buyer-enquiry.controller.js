import BuyerEnquiryService
    from "../../services/buyer/buyer-enquiry.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class BuyerEnquiryController {

    /*
    |--------------------------------------------------------------------------
    | CREATE ENQUIRY
    |--------------------------------------------------------------------------
    */

    async createEnquiry(req, res, next) {

        try {

            const buyerId = req.user._id;

            const enquiry =
                await BuyerEnquiryService.createEnquiry(
                    buyerId,
                    req.body
                );

            return res.status(201).json(
                new ApiResponse(
                    201,
                    enquiry,
                    "Enquiry submitted successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | GET MY ENQUIRIES
    |--------------------------------------------------------------------------
    */

    async getMyEnquiries(req, res, next) {

        try {

            const buyerId = req.user._id;

            const enquiries =
                await BuyerEnquiryService.getMyEnquiries(
                    buyerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    enquiries,
                    "Your enquiries fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | GET ENQUIRY DETAILS
    |--------------------------------------------------------------------------
    */

    async getEnquiryById(req, res, next) {

        try {

            const buyerId = req.user._id;

            const { enquiryId } = req.params;

            const enquiry =
                await BuyerEnquiryService.getEnquiryById(
                    buyerId,
                    enquiryId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    enquiry,
                    "Enquiry details fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new BuyerEnquiryController();