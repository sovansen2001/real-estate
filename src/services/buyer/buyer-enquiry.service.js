import mongoose from "mongoose";

import Enquiry from "../../models/enquiry.model.js";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

class BuyerEnquiryService {

    /*
    |--------------------------------------------------------------------------
    | CREATE ENQUIRY
    |--------------------------------------------------------------------------
    */

    async createEnquiry(buyerId, enquiryData) {

        const {
            property,
            message = ""
        } = enquiryData;

        if (!mongoose.Types.ObjectId.isValid(property)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | GET BUYER DETAILS
        |--------------------------------------------------------------------------
        */

        const buyer = await mongoose.model("User").findOne({
            _id: buyerId,
            role: "Buyer",
            isDeleted: false,
            isActive: true
        })
            .select("fullName email phone")
            .lean();

        if (!buyer) {
            throw new ApiError(
                404,
                "Buyer not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | PROPERTY MUST BE PUBLIC
        |--------------------------------------------------------------------------
        */

        const propertyData = await Property.findOne({
            _id: property,
            isDeleted: false,
            "approval.status": "Approved",
            listingStatus: "Active"
        })
            .select("_id")
            .lean();

        if (!propertyData) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE ENQUIRY
        |--------------------------------------------------------------------------
        */

        const enquiry = await Enquiry.create({

            property: propertyData._id,

            user: buyerId,

            name: buyer.fullName,

            email: buyer.email,

            phone: buyer.phone,

            message: message.trim()

        });

        /*
        |--------------------------------------------------------------------------
        | INCREMENT ENQUIRY COUNT
        |--------------------------------------------------------------------------
        */

        await Property.updateOne(
            {
                _id: propertyData._id
            },
            {
                $inc: {
                    "analytics.enquiries": 1
                }
            }
        );

        return enquiry;
    }


    /*
    |--------------------------------------------------------------------------
    | GET MY ENQUIRIES
    |--------------------------------------------------------------------------
    */

    async getMyEnquiries(buyerId) {

        const enquiries = await Enquiry.find({
            user: buyerId,
            isDeleted: false
        })
            .populate({
                path: "property",
                select: [
                    "title",
                    "slug",
                    "propertyType",
                    "listingType",
                    "price",
                    "currency",
                    "location",
                    "images",
                    "isFeatured"
                ].join(" ")
            })
            .sort({
                createdAt: -1
            })
            .lean();

        return enquiries;
    }


    /*
    |--------------------------------------------------------------------------
    | GET ENQUIRY DETAILS
    |--------------------------------------------------------------------------
    */

    async getEnquiryById(
        buyerId,
        enquiryId
    ) {

        if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
            throw new ApiError(
                400,
                "Invalid enquiry id."
            );
        }

        const enquiry = await Enquiry.findOne({

            _id: enquiryId,

            user: buyerId,

            isDeleted: false

        })
            .populate({
                path: "property",
                select: [
                    "title",
                    "slug",
                    "propertyType",
                    "listingType",
                    "price",
                    "currency",
                    "location",
                    "images",
                    "seller"
                ].join(" ")
            })
            .lean();

        if (!enquiry) {
            throw new ApiError(
                404,
                "Enquiry not found."
            );
        }

        return enquiry;
    }
}

export default new BuyerEnquiryService();