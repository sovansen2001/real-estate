import mongoose from "mongoose";
import Enquiry from "../models/enquiry.model.js";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

class EnquiryService {

    /*
    |--------------------------------------------------------------------------
    | Create Property Enquiry
    |--------------------------------------------------------------------------
    */
    async createEnquiry(enquiryData, userId = null) {
        const {
            property,
            name,
            email,
            phone,
            message
        } = enquiryData;
        // Validate property ID
        if (!mongoose.Types.ObjectId.isValid(property)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }
        // Check that the property exists and is publicly visible
        const propertyData = await Property.findOne({
            _id: property,
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved"
        }).select("_id seller");
        if (!propertyData) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }
        const enquiry = await Enquiry.create({
            property,
            user: userId,
            name,
            email,
            phone,
            message
        });
        return enquiry;
    }

    /*
    |--------------------------------------------------------------------------
    | Get Seller Enquiries
    |--------------------------------------------------------------------------
    */
    async getSellerEnquiries(sellerId) {
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            throw new ApiError(
                400,
                "Invalid seller id."
            );
        }
        const enquiries = await Enquiry.find({
            isDeleted: false
        })
            .populate({
                path: "property",
                match: {
                    seller: sellerId,
                    isDeleted: false
                },
                select: "title price location images"
            })
            .populate(
                "user",
                "name email phone"
            )
            .sort({
                createdAt: -1
            })
            .lean();
        // Remove enquiries whose property does not belong to this seller
        return enquiries.filter(
            enquiry => enquiry.property
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Get Enquiry By Id
    |--------------------------------------------------------------------------
    */
    async getEnquiryById(enquiryId, sellerId) {
        if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
            throw new ApiError(
                400,
                "Invalid enquiry id."
            );
        }
        const enquiry = await Enquiry.findOne({
            _id: enquiryId,
            isDeleted: false
        })
            .populate({
                path: "property",
                match: {
                    seller: sellerId,
                    isDeleted: false
                },
                select: "title price location images"
            })
            .populate(
                "user",
                "name email phone"
            )
            .lean();
        if (!enquiry || !enquiry.property) {
            throw new ApiError(
                404,
                "Enquiry not found."
            );
        }
        return enquiry;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Enquiry Status
    |--------------------------------------------------------------------------
    */
    async updateEnquiryStatus(
        enquiryId,
        sellerId,
        status
    ) {
        const allowedStatuses = [
            "New",
            "Contacted",
            "In Progress",
            "Closed"
        ];
        if (!allowedStatuses.includes(status)) {
            throw new ApiError(
                400,
                "Invalid enquiry status."
            );
        }
        const enquiry =
            await this.getEnquiryById(
                enquiryId,
                sellerId
            );
        const updatedEnquiry =
            await Enquiry.findByIdAndUpdate(
                enquiry._id,
                {
                    status
                },
                {
                    new: true
                }
            )
                .populate(
                    "property",
                    "title price location"
                )
                .lean();
        return updatedEnquiry;
    }
}
export default new EnquiryService();