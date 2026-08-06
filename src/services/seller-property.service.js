import mongoose from "mongoose";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| SELLER PROPERTY SERVICE
|--------------------------------------------------------------------------
| Handles seller property business logic.
|--------------------------------------------------------------------------
*/

class SellerPropertyService {

    /*
    |--------------------------------------------------------------------------
    | GET SELLER PROPERTIES
    |--------------------------------------------------------------------------
    |
    | Features:
    | ✔ Pagination
    | ✔ Search
    | ✔ Approval Status Filter
    | ✔ Listing Status Filter
    | ✔ Sorting
    |--------------------------------------------------------------------------
    */

    async getSellerProperties(
        sellerId,
        query = {}
    ) {

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            throw new ApiError(400, "Invalid seller id.");
        }

        const page = Math.max(
            Number(query.page) || 1,
            1
        );

        const limit = Math.min(
            Number(query.limit) || 10,
            100
        );

        const skip = (page - 1) * limit;

        const filter = {
            seller: sellerId,
            isDeleted: false
        };

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if (query.search?.trim()) {

            filter.title = {
                $regex: query.search.trim(),
                $options: "i"
            };

        }

        /*
        |--------------------------------------------------------------------------
        | APPROVAL FILTER
        |--------------------------------------------------------------------------
        */

        if (query.approvalStatus) {

            filter["approval.status"] =
                query.approvalStatus;

        }

        /*
        |--------------------------------------------------------------------------
        | LISTING FILTER
        |--------------------------------------------------------------------------
        */

        if (query.listingStatus) {

            filter.listingStatus =
                query.listingStatus;

        }

        /*
        |--------------------------------------------------------------------------
        | SORTING
        |--------------------------------------------------------------------------
        */

        let sort = {
            createdAt: -1
        };

        switch (query.sort) {

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "priceLow":
                sort = { price: 1 };
                break;

            case "priceHigh":
                sort = { price: -1 };
                break;

            case "title":
                sort = { title: 1 };
                break;

            default:
                sort = {
                    createdAt: -1
                };

        }

        /*
        |--------------------------------------------------------------------------
        | FETCH DATA
        |--------------------------------------------------------------------------
        */

        const [properties, totalProperties] =
            await Promise.all([

                Property.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),

                Property.countDocuments(filter)

            ]);

        return {

            properties,

            pagination: {

                totalProperties,

                currentPage: page,

                totalPages: Math.ceil(
                    totalProperties / limit
                ),

                limit,

                hasNextPage:
                    page <
                    Math.ceil(
                        totalProperties / limit
                    ),

                hasPreviousPage:
                    page > 1

            }

        };

    }

    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */

    async getSellerPropertyById(
        sellerId,
        propertyId
    ) {

        if (
            !mongoose.Types.ObjectId.isValid(
                propertyId
            )
        ) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        const property =
            await Property.findOne({

                _id: propertyId,

                seller: sellerId,

                isDeleted: false

            }).lean();

        if (!property) {

            throw new ApiError(
                404,
                "Property not found."
            );

        }

        return property;

    }

    /*
    |--------------------------------------------------------------------------
    | PROPERTY COUNTS
    |--------------------------------------------------------------------------
    */

    async getSellerPropertyCounts(
        sellerId
    ) {

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {

            throw new ApiError(
                400,
                "Invalid seller id."
            );

        }

        const [
            total,
            active,
            pending,
            approved,
            rejected,
            sold,
            rented
        ] = await Promise.all([

            Property.countDocuments({
                seller: sellerId,
                isDeleted: false
            }),

            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Active",
                isDeleted: false
            }),

            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Pending",
                isDeleted: false
            }),

            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Approved",
                isDeleted: false
            }),

            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Rejected",
                isDeleted: false
            }),

            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Sold",
                isDeleted: false
            }),

            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Rented",
                isDeleted: false
            })

        ]);

        return {

            total,

            active,

            pending,

            approved,

            rejected,

            sold,

            rented

        };

    }

}

export default new SellerPropertyService();