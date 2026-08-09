import mongoose from "mongoose";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| SELLER PROPERTY SERVICE
|--------------------------------------------------------------------------
|
| Handles all seller property business logic.
|
| Features:
| ✔ Create property
| ✔ Get seller properties
| ✔ Search
| ✔ Pagination
| ✔ Approval filter
| ✔ Listing status filter
| ✔ Sorting
| ✔ Get single property
| ✔ Update property
| ✔ Delete property
| ✔ Submit property for approval
| ✔ Seller property statistics
|
|--------------------------------------------------------------------------
*/

class SellerPropertyService {

    /*
    |--------------------------------------------------------------------------
    | CHECK PROPERTY OWNERSHIP
    |--------------------------------------------------------------------------
    */

    async getPropertyForSeller(propertyId, sellerId) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        const property = await Property.findOne({
            _id: propertyId,
            seller: sellerId,
            isDeleted: false
        });

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
    | CHECK WHETHER PROPERTY CAN BE EDITED
    |--------------------------------------------------------------------------
    |
    | Only Draft and Rejected properties can be edited.
    |
    |--------------------------------------------------------------------------
    */

    canEdit(property) {

        return ["Draft", "Rejected"].includes(
            property.approval.status
        );

    }


    /*
    |--------------------------------------------------------------------------
    | CHECK WHETHER PROPERTY CAN BE DELETED
    |--------------------------------------------------------------------------
    */

    canDelete(property) {

        return ["Draft", "Rejected"].includes(
            property.approval.status
        );

    }


    /*
    |--------------------------------------------------------------------------
    | CHECK WHETHER PROPERTY CAN BE SUBMITTED
    |--------------------------------------------------------------------------
    */

    canSubmit(property) {

        return ["Draft", "Rejected"].includes(
            property.approval.status
        );

    }


    /*
    |--------------------------------------------------------------------------
    | CREATE PROPERTY
    |--------------------------------------------------------------------------
    */

    async createProperty(sellerId, propertyData) {

        const property = await Property.create({

            ...propertyData,

            seller: sellerId,

            approval: {
                status: "Draft"
            },

            listingStatus: "Inactive"

        });

        return property;
    }


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
    |
    |--------------------------------------------------------------------------
    */

    async getSellerProperties(
        sellerId,
        query = {}
    ) {

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {

            throw new ApiError(
                400,
                "Invalid seller id."
            );

        }

        const page = Math.max(
            Number(query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(query.limit) || 10, 1),
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
        | APPROVAL STATUS FILTER
        |--------------------------------------------------------------------------
        */

        if (query.approvalStatus) {

            filter["approval.status"] =
                query.approvalStatus;

        }


        /*
        |--------------------------------------------------------------------------
        | LISTING STATUS FILTER
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

                sort = {
                    createdAt: 1
                };

                break;


            case "priceLow":

                sort = {
                    price: 1
                };

                break;


            case "priceHigh":

                sort = {
                    price: -1
                };

                break;


            case "title":

                sort = {
                    title: 1
                };

                break;


            default:

                sort = {
                    createdAt: -1
                };

        }


        /*
        |--------------------------------------------------------------------------
        | FETCH PROPERTIES
        |--------------------------------------------------------------------------
        */

        const [
            properties,
            totalProperties
        ] = await Promise.all([

            Property.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),

            Property.countDocuments(filter)

        ]);


        const totalPages = Math.ceil(
            totalProperties / limit
        );


        return {

            properties,

            pagination: {

                totalProperties,

                currentPage: page,

                totalPages,

                limit,

                hasNextPage:
                    page < totalPages,

                hasPreviousPage:
                    page > 1

            }

        };

    }


    /*
    |--------------------------------------------------------------------------
    | GET SINGLE PROPERTY
    |--------------------------------------------------------------------------
    */

    async getSellerPropertyById(
        sellerId,
        propertyId
    ) {

        const property =
            await this.getPropertyForSeller(
                propertyId,
                sellerId
            );

        return property;
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE PROPERTY
    |--------------------------------------------------------------------------
    |
    | Seller can update property details only when:
    |
    | Draft
    | Rejected
    |
    | Protected fields cannot be changed by the seller.
    |
    |--------------------------------------------------------------------------
    */

    async updateProperty(
        propertyId,
        sellerId,
        updateData
    ) {

        const property =
            await this.getPropertyForSeller(
                propertyId,
                sellerId
            );


        /*
        |--------------------------------------------------------------------------
        | CHECK EDIT PERMISSION
        |--------------------------------------------------------------------------
        */

        if (!this.canEdit(property)) {

            throw new ApiError(
                403,
                "Only Draft or Rejected properties can be edited."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | SELLER-EDITABLE FIELDS
        |--------------------------------------------------------------------------
        */

        const allowedFields = [

            "title",

            "description",

            "propertyType",

            "listingType",

            "price",

            "location",

            "bedrooms",

            "bathrooms",

            "area",

            "amenities",

            "furnishing",

            "parking",

            "features",

            "images"

        ];


        /*
        |--------------------------------------------------------------------------
        | UPDATE ONLY ALLOWED FIELDS
        |--------------------------------------------------------------------------
        */

        for (const field of allowedFields) {

            if (updateData[field] !== undefined) {

                property[field] = updateData[field];

            }

        }


        await property.save();

        return property;

    }


    /*
    |--------------------------------------------------------------------------
    | DELETE PROPERTY
    |--------------------------------------------------------------------------
    |
    | Soft delete only.
    |
    |--------------------------------------------------------------------------
    */

    async deleteProperty(
        propertyId,
        sellerId
    ) {

        const property =
            await this.getPropertyForSeller(
                propertyId,
                sellerId
            );


        /*
        |--------------------------------------------------------------------------
        | CHECK DELETE PERMISSION
        |--------------------------------------------------------------------------
        */

        if (!this.canDelete(property)) {

            throw new ApiError(
                403,
                "This property cannot be deleted."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | SOFT DELETE
        |--------------------------------------------------------------------------
        */

        property.isDeleted = true;

        property.deletedAt = new Date();

        await property.save();

        return true;

    }


    /*
    |--------------------------------------------------------------------------
    | SUBMIT PROPERTY FOR APPROVAL
    |--------------------------------------------------------------------------
    */

    async submitForApproval(
        propertyId,
        sellerId
    ) {

        const property =
            await this.getPropertyForSeller(
                propertyId,
                sellerId
            );


        /*
        |--------------------------------------------------------------------------
        | CHECK SUBMISSION PERMISSION
        |--------------------------------------------------------------------------
        */

        if (!this.canSubmit(property)) {

            throw new ApiError(
                400,
                "Property cannot be submitted."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | REQUIRE PROPERTY IMAGE
        |--------------------------------------------------------------------------
        */

        if (
            !property.images ||
            property.images.length === 0
        ) {

            throw new ApiError(
                400,
                "Upload at least one property image."
            );

        }


        /*
        |--------------------------------------------------------------------------
        | CHANGE APPROVAL STATUS
        |--------------------------------------------------------------------------
        */

        property.approval.status = "Pending";


        /*
        |--------------------------------------------------------------------------
        | Keep Listing Inactive Until Admin Approval
        |--------------------------------------------------------------------------
        */

        property.listingStatus = "Inactive";


        await property.save();

        return property;

    }


    /*
    |--------------------------------------------------------------------------
    | SELLER PROPERTY STATISTICS
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
            inactive,
            pending,
            approved,
            rejected,
            sold,
            rented,
            draft
        ] = await Promise.all([

            /*
            |--------------------------------------------------------------------------
            | TOTAL
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | ACTIVE
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                listingStatus: "Active",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | INACTIVE
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                listingStatus: "Inactive",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | PENDING
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Pending",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | APPROVED
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Approved",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | REJECTED
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Rejected",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | SOLD
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                listingStatus: "Sold",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | RENTED
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                listingStatus: "Rented",

                isDeleted: false

            }),


            /*
            |--------------------------------------------------------------------------
            | DRAFT
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Draft",

                isDeleted: false

            })

        ]);


        return {

            total,

            active,

            inactive,

            pending,

            approved,

            rejected,

            sold,

            rented,

            draft

        };

    }

}

export default new SellerPropertyService();