import mongoose from "mongoose";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| ADMIN PROPERTY MANAGEMENT SERVICE
|--------------------------------------------------------------------------
|
| Handles all admin-side property management business logic.
|
| Features:
| ✔ List every property on the platform (pagination, search, filters)
| ✔ Get single property (admin can view any seller's property)
| ✔ Approve a property submitted for review
| ✔ Reject a property with a reason
| ✔ Feature / unfeature a property
| ✔ Admin delete (soft delete) any property
| ✔ Platform-wide property statistics
|
|--------------------------------------------------------------------------
*/

class PropertyManagementService {

    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY BY ID (ADMIN)
    |--------------------------------------------------------------------------
    */

    async getPropertyForAdmin(propertyId) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {

            throw new ApiError(
                400,
                "Invalid property id."
            );

        }

        const property = await Property.findOne({
            _id: propertyId,
            isDeleted: false
        }).populate("seller", "fullName email phone role");

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
    | LIST ALL PROPERTIES
    |--------------------------------------------------------------------------
    |
    | Features:
    | ✔ Pagination
    | ✔ Search (title)
    | ✔ Approval Status Filter (Draft / Pending / Approved / Rejected)
    | ✔ Listing Status Filter
    | ✔ Property Type / Listing Type Filter
    | ✔ Seller Filter
    | ✔ Sorting
    |
    |--------------------------------------------------------------------------
    */

    async getAllProperties(query = {}) {

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
            isDeleted: false
        };

        if (query.search?.trim()) {

            filter.title = {
                $regex: query.search.trim(),
                $options: "i"
            };

        }

        if (query.approvalStatus) {

            filter["approval.status"] = query.approvalStatus;

        }

        if (query.listingStatus) {

            filter.listingStatus = query.listingStatus;

        }

        if (query.propertyType) {

            filter.propertyType = query.propertyType;

        }

        if (query.listingType) {

            filter.listingType = query.listingType;

        }

        if (query.seller) {

            if (!mongoose.Types.ObjectId.isValid(query.seller)) {

                throw new ApiError(
                    400,
                    "Invalid seller id filter."
                );

            }

            filter.seller = query.seller;

        }

        let sort = { createdAt: -1 };

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

            default:
                sort = { createdAt: -1 };

        }

        const [properties, totalProperties] = await Promise.all([

            Property.find(filter)
                .populate("seller", "fullName email phone role")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),

            Property.countDocuments(filter)

        ]);

        const totalPages = Math.ceil(totalProperties / limit);

        return {

            properties,

            pagination: {
                totalProperties,
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
    | APPROVE PROPERTY
    |--------------------------------------------------------------------------
    |
    | Only properties in "Pending" status can be approved.
    | Approving a property also activates its listing.
    |
    |--------------------------------------------------------------------------
    */

    async approveProperty(propertyId, adminId) {

        const property = await this.getPropertyForAdmin(propertyId);

        if (property.approval.status !== "Pending") {

            throw new ApiError(
                400,
                "Only properties pending review can be approved."
            );

        }

        property.approval.status = "Approved";
        property.approval.reviewedBy = adminId;
        property.approval.reviewedAt = new Date();
        property.approval.rejectionReason = null;

        property.listingStatus = "Active";

        await property.save();

        return property;

    }


    /*
    |--------------------------------------------------------------------------
    | REJECT PROPERTY
    |--------------------------------------------------------------------------
    */

    async rejectProperty(propertyId, adminId, reason) {

        if (!reason?.trim()) {

            throw new ApiError(
                400,
                "A rejection reason is required."
            );

        }

        const property = await this.getPropertyForAdmin(propertyId);

        if (property.approval.status !== "Pending") {

            throw new ApiError(
                400,
                "Only properties pending review can be rejected."
            );

        }

        property.approval.status = "Rejected";
        property.approval.reviewedBy = adminId;
        property.approval.reviewedAt = new Date();
        property.approval.rejectionReason = reason.trim();

        property.listingStatus = "Inactive";

        await property.save();

        return property;

    }


    /*
    |--------------------------------------------------------------------------
    | TOGGLE FEATURED
    |--------------------------------------------------------------------------
    */

    async setFeatured(propertyId, isFeatured) {

        const property = await this.getPropertyForAdmin(propertyId);

        if (isFeatured && property.approval.status !== "Approved") {

            throw new ApiError(
                400,
                "Only approved properties can be featured."
            );

        }

        property.isFeatured = isFeatured;

        await property.save();

        return property;

    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN DELETE PROPERTY
    |--------------------------------------------------------------------------
    |
    | Admin can remove any property regardless of its approval status
    | (e.g. policy violations).
    |
    |--------------------------------------------------------------------------
    */

    async deleteProperty(propertyId) {

        const property = await this.getPropertyForAdmin(propertyId);

        property.isDeleted = true;
        property.listingStatus = "Inactive";

        await property.save();

        return true;

    }


    /*
    |--------------------------------------------------------------------------
    | PLATFORM PROPERTY STATISTICS
    |--------------------------------------------------------------------------
    */

    async getPropertyStatistics() {

        const [
            total,
            pending,
            approved,
            rejected,
            draft,
            active,
            inactive,
            sold,
            rented,
            featured
        ] = await Promise.all([

            Property.countDocuments({ isDeleted: false }),
            Property.countDocuments({ isDeleted: false, "approval.status": "Pending" }),
            Property.countDocuments({ isDeleted: false, "approval.status": "Approved" }),
            Property.countDocuments({ isDeleted: false, "approval.status": "Rejected" }),
            Property.countDocuments({ isDeleted: false, "approval.status": "Draft" }),
            Property.countDocuments({ isDeleted: false, listingStatus: "Active" }),
            Property.countDocuments({ isDeleted: false, listingStatus: "Inactive" }),
            Property.countDocuments({ isDeleted: false, listingStatus: "Sold" }),
            Property.countDocuments({ isDeleted: false, listingStatus: "Rented" }),
            Property.countDocuments({ isDeleted: false, isFeatured: true })

        ]);

        return {
            total,
            approval: { pending, approved, rejected, draft },
            listing: { active, inactive, sold, rented },
            featured
        };

    }

}

export default new PropertyManagementService();
