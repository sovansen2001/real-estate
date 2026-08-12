import BrokerEnquiryService
    from "../../services/broker/broker-enquiry.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class BrokerEnquiryController {

    async getMyEnquiries(req, res, next) {

        try {

            const brokerId = req.user._id;

            const result =
                await BrokerEnquiryService.getMyEnquiries(
                    brokerId,
                    req.query
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Broker enquiries fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    async getEnquiryById(req, res, next) {

        try {

            const brokerId = req.user._id;

            const result =
                await BrokerEnquiryService.getEnquiryById(
                    brokerId,
                    req.params.enquiryId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Enquiry details fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }


    async updateEnquiryStatus(req, res, next) {

        try {

            const brokerId = req.user._id;

            const result =
                await BrokerEnquiryService.updateEnquiryStatus(
                    brokerId,
                    req.params.enquiryId,
                    req.body.status
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Enquiry status updated successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
}

export default new BrokerEnquiryController();