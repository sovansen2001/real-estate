import EnquiryService from "../services/enquiry.service.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

class EnquiryController {

    /*
    |--------------------------------------------------------------------------
    | Create Property Enquiry
    |--------------------------------------------------------------------------
    | Public API
    |--------------------------------------------------------------------------
    */
    createEnquiry = asyncHandler(async (req, res) => {
        const userId = req.user?._id || null;
        const enquiry =
            await EnquiryService.createEnquiry(
                req.body,
                userId
            );
        return res.status(201).json(
            new ApiResponse(
                201,
                enquiry,
                "Enquiry submitted successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Get Seller Enquiries
    |--------------------------------------------------------------------------
    | Authentication required
    |--------------------------------------------------------------------------
    */
    getSellerEnquiries = asyncHandler(async (req, res) => {
        const enquiries =
            await EnquiryService.getSellerEnquiries(
                req.user._id
            );
        return res.status(200).json(
            new ApiResponse(
                200,
                enquiries,
                "Enquiries fetched successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Get Enquiry By Id
    |--------------------------------------------------------------------------
    */
    getEnquiryById = asyncHandler(async (req, res) => {
        const enquiry =
            await EnquiryService.getEnquiryById(
                req.params.enquiryId,
                req.user._id
            );
        return res.status(200).json(
            new ApiResponse(
                200,
                enquiry,
                "Enquiry fetched successfully."
            )
        );
    });

    /*
    |--------------------------------------------------------------------------
    | Update Enquiry Status
    |--------------------------------------------------------------------------
    */
    updateEnquiryStatus = asyncHandler(async (req, res) => {
        const enquiry =
            await EnquiryService.updateEnquiryStatus(
                req.params.enquiryId,
                req.user._id,
                req.body.status
            );
        return res.status(200).json(
            new ApiResponse(
                200,
                enquiry,
                "Enquiry status updated successfully."
            )
        );
    });
}
export default new EnquiryController();