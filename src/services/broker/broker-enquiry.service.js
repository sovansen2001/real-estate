import mongoose from "mongoose";

import Enquiry from "../../models/enquiry.model.js";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

class BrokerEnquiryService {

    /*
    |--------------------------------------------------------------------------
    | GET ENQUIRIES FOR BROKER'S PROPERTIES
    |--------------------------------------------------------------------------
    */

    async getMyEnquiries(brokerId, query = {}) {

        const page = Math.max(
            Number(query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(query.limit) || 10, 1),
            50
        );

        const skip = (page - 1) * limit;

        const propertyIds = await Property.find({
            seller: brokerId,
            isDeleted: false
        }).distinct("_id");

        const filter = {
            property: {
                $in: propertyIds
            },
            isDeleted: false
        };

        if (query.status?.trim()) {
            filter.status = query.status.trim();
        }

        const [
            enquiries,
            totalEnquiries
        ] = await Promise.all([

            Enquiry.find(filter)
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
                        "images"
                    ].join(" ")
                })
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            Enquiry.countDocuments(filter)

        ]);

        const totalPages =
            Math.ceil(totalEnquiries / limit);

        return {
            enquiries,
            pagination: {
                totalEnquiries,
                currentPage: page,
                totalPages,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }


    /*
    |--------------------------------------------------------------------------
    | GET ENQUIRY DETAILS
    |--------------------------------------------------------------------------
    */

    async getEnquiryById(
        brokerId,
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
            isDeleted: false
        })
            .populate({
                path: "property",
                match: {
                    seller: brokerId,
                    isDeleted: false
                },
                select: [
                    "title",
                    "slug",
                    "propertyType",
                    "listingType",
                    "price",
                    "currency",
                    "location",
                    "images"
                ].join(" ")
            })
            .populate({
                path: "user",
                select: [
                    "fullName",
                    "email",
                    "phone",
                    "whatsappNumber"
                ].join(" ")
            })
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
    | UPDATE ENQUIRY STATUS
    |--------------------------------------------------------------------------
    */

    async updateEnquiryStatus(
        brokerId,
        enquiryId,
        status
    ) {

        if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
            throw new ApiError(
                400,
                "Invalid enquiry id."
            );
        }

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

        const propertyIds = await Property.find({
            seller: brokerId,
            isDeleted: false
        }).distinct("_id");

        const enquiry = await Enquiry.findOne({
            _id: enquiryId,
            property: {
                $in: propertyIds
            },
            isDeleted: false
        });

        if (!enquiry) {
            throw new ApiError(
                404,
                "Enquiry not found."
            );
        }

        enquiry.status = status;

        await enquiry.save();

        return enquiry;
    }
}

export default new BrokerEnquiryService();