import mongoose from "mongoose";

import Enquiry from "../models/enquiry.model.js";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

class EnquiryService {

    /*
    |--------------------------------------------------------------------------
    | CREATE PROPERTY ENQUIRY
    |--------------------------------------------------------------------------
    |
    | Public endpoint.
    |
    | A visitor can submit an enquiry without authentication.
    | If authentication exists, userId is stored.
    |
    |--------------------------------------------------------------------------
    */

    async createEnquiry(enquiryData, userId = null) {

        const {
            property,
            name,
            email,
            phone,
            message = ""
        } = enquiryData;

        /*
        |--------------------------------------------------------------------------
        | VALIDATE PROPERTY ID
        |--------------------------------------------------------------------------
        */

        if (
            !mongoose.Types.ObjectId.isValid(property)
        ) {

            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK PUBLIC PROPERTY
        |--------------------------------------------------------------------------
        |
        | An enquiry can only be created for a property
        | that is publicly visible.
        |
        |--------------------------------------------------------------------------
        */

        const propertyData =
            await Property.findOne({

                _id: property,

                isDeleted: false,

                listingStatus: "Active",

                "approval.status": "Approved"

            })
                .select("_id seller")
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

        const enquiry =
            await Enquiry.create({

                property: propertyData._id,

                user: userId,

                name,

                email,

                phone,

                message

            });

        /*
        |--------------------------------------------------------------------------
        | INCREMENT PROPERTY ENQUIRY COUNT
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
    | GET SELLER ENQUIRIES
    |--------------------------------------------------------------------------
    */

    async getSellerEnquiries(sellerId) {

        if (
            !mongoose.Types.ObjectId.isValid(
                sellerId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid seller id."
            );
        }

        const enquiries =
            await Enquiry.find({

                isDeleted: false

            })
                .populate({

                    path: "property",

                    match: {

                        seller: sellerId,

                        isDeleted: false

                    },

                    select:
                        "title price location images"

                })
                .populate(
                    "user",
                    "name email phone"
                )
                .sort({
                    createdAt: -1
                })
                .lean();

        /*
        |--------------------------------------------------------------------------
        | REMOVE ENQUIRIES WHOSE PROPERTY DOES NOT
        | BELONG TO THIS SELLER
        |--------------------------------------------------------------------------
        */

        return enquiries.filter(
            enquiry => enquiry.property
        );
    }

    /*
    |--------------------------------------------------------------------------
    | GET ENQUIRY BY ID
    |--------------------------------------------------------------------------
    */

    async getEnquiryById(
        enquiryId,
        sellerId
    ) {

        if (
            !mongoose.Types.ObjectId.isValid(
                enquiryId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid enquiry id."
            );
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                sellerId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid seller id."
            );
        }

        const enquiry =
            await Enquiry.findOne({

                _id: enquiryId,

                isDeleted: false

            })
                .populate({

                    path: "property",

                    match: {

                        seller: sellerId,

                        isDeleted: false

                    },

                    select:
                        "title price location images"

                })
                .populate(
                    "user",
                    "name email phone"
                )
                .lean();

        if (
            !enquiry ||
            !enquiry.property
        ) {

            throw new ApiError(
                404,
                "Enquiry not found."
            );
        }

        return enquiry;
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE ENQUIRY STATUS
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

        if (
            !allowedStatuses.includes(status)
        ) {

            throw new ApiError(
                400,
                "Invalid enquiry status."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | VERIFY SELLER OWNS THE ENQUIRY
        |--------------------------------------------------------------------------
        */

        const enquiry =
            await this.getEnquiryById(
                enquiryId,
                sellerId
            );

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        const updatedEnquiry =
            await Enquiry.findByIdAndUpdate(

                enquiry._id,

                {
                    $set: {
                        status
                    }
                },

                {
                    new: true,
                    runValidators: true
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