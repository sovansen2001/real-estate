import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| Property Service
|--------------------------------------------------------------------------
|
| This service contains all business logic related to Property.
|
| NOTE:
| -----
| Do NOT use req or res in this file.
| Controllers call these methods.
|
|--------------------------------------------------------------------------
*/

class PropertyService {

    /*
    |--------------------------------------------------------------------------
    | Check Whether Property Can Be Edited
    |--------------------------------------------------------------------------
    */

    canEdit(property) {

        return ["Draft", "Rejected"].includes(
            property.approval.status
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Check Whether Property Can Be Deleted
    |--------------------------------------------------------------------------
    */

    canDelete(property) {

        return ["Draft", "Rejected"].includes(
            property.approval.status
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Check Whether Property Can Be Submitted
    |--------------------------------------------------------------------------
    */

    canSubmit(property) {

        return ["Draft", "Rejected"].includes(
            property.approval.status
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Create Property
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
    | Get Seller Properties
    |--------------------------------------------------------------------------
    */

    async getSellerProperties(sellerId) {

        return await Property.find({

            seller: sellerId,

            isDeleted: false

        })
            .sort({
                createdAt: -1
            });

    }

    /*
    |--------------------------------------------------------------------------
    | Get Property By Id
    |--------------------------------------------------------------------------
    */

    async getPropertyById(propertyId, sellerId) {

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
    | Update Property
    |--------------------------------------------------------------------------
    */

    async updateProperty(
        propertyId,
        sellerId,
        updateData
    ) {

        const property = await this.getPropertyById(

            propertyId,

            sellerId

        );

        /*
        |--------------------------------------------------------------------------
        | Only Draft and Rejected properties can be edited.
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
        | Update Property Data
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
    "features"
];

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
    | Delete Property
    |--------------------------------------------------------------------------
    */

    async deleteProperty(
        propertyId,
        sellerId
    ) {

        const property = await this.getPropertyById(

            propertyId,

            sellerId

        );

        /*
        |--------------------------------------------------------------------------
        | Draft & Rejected properties can be deleted.
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
        | Soft Delete
        |--------------------------------------------------------------------------
        */

        property.isDeleted = true;

        property.deletedAt = new Date();

        await property.save();

        return true;

    }

    /*
    |--------------------------------------------------------------------------
    | Submit Property For Approval
    |--------------------------------------------------------------------------
    */

    async submitForApproval(
        propertyId,
        sellerId
    ) {

        const property = await this.getPropertyById(

            propertyId,

            sellerId

        );

        /*
        |--------------------------------------------------------------------------
        | Allow submission only from Draft or Rejected.
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
        | Require at least one image.
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
        | Change Approval Status
        |--------------------------------------------------------------------------
        */

        property.approval.status = "Pending";

        await property.save();

        return property;

    }

    /*
    |--------------------------------------------------------------------------
    | Seller Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    async getDashboardStats(sellerId) {

        const [

            totalProperties,

            draftProperties,

            pendingProperties,

            approvedProperties,

            rejectedProperties,

            activeProperties

        ] = await Promise.all([

            /*
            |--------------------------------------------------------------------------
            | Total Properties
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                isDeleted: false

            }),

            /*
            |--------------------------------------------------------------------------
            | Draft Properties
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Draft",

                isDeleted: false

            }),

            /*
            |--------------------------------------------------------------------------
            | Pending Properties
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Pending",

                isDeleted: false

            }),

            /*
            |--------------------------------------------------------------------------
            | Approved Properties
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Approved",

                isDeleted: false

            }),

            /*
            |--------------------------------------------------------------------------
            | Rejected Properties
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                "approval.status": "Rejected",

                isDeleted: false

            }),

            /*
            |--------------------------------------------------------------------------
            | Active Properties
            |--------------------------------------------------------------------------
            */

            Property.countDocuments({

                seller: sellerId,

                listingStatus: "Active",

                isDeleted: false

            })

        ]);

        return {

            totalProperties,

            draftProperties,

            pendingProperties,

            approvedProperties,

            rejectedProperties,

            activeProperties

        };

    }

}

export default new PropertyService();