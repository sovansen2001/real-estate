import mongoose from "mongoose";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";
class BrokerPropertyService {

    /*
    |--------------------------------------------------------------------------
    | GET BROKER PROPERTIES
    |--------------------------------------------------------------------------
    */
    async getMyProperties(brokerId, query = {}) {
        if (!brokerId) {
            throw new ApiError(
                401,
                "Broker authentication required."
            );
        }
        const page = Math.max(
            Number(query.page) || 1,
            1
        );
        const limit = Math.min(
            Math.max(Number(query.limit) || 12, 1),
            50
        );
        const skip = (page - 1) * limit;
        const filter = {
            seller: brokerId,
            isDeleted: false
        };

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */
        if (query.search?.trim()) {
            const search = query.search.trim();
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    "location.city": {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    "location.locality": {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | APPROVAL STATUS
        |--------------------------------------------------------------------------
        */
        if (query.approvalStatus?.trim()) {
            filter["approval.status"] =
                query.approvalStatus.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | LISTING STATUS
        |--------------------------------------------------------------------------
        */
        if (query.listingStatus?.trim()) {
            filter.listingStatus =
                query.listingStatus.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | PROPERTY TYPE
        |--------------------------------------------------------------------------
        */
        if (query.propertyType?.trim()) {
            filter.propertyType =
                query.propertyType.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | FETCH
        |--------------------------------------------------------------------------
        */
        const [
            properties,
            totalProperties
        ] = await Promise.all([
            Property.find(filter)
                .select([
                    "title",
                    "slug",
                    "propertyType",
                    "listingType",
                    "price",
                    "currency",
                    "area",
                    "location",
                    "images",
                    "approval",
                    "listingStatus",
                    "isFeatured",
                    "analytics",
                    "createdAt",
                    "updatedAt"
                ].join(" "))
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean(),
            Property.countDocuments(filter)
        ]);
        const totalPages =
            Math.ceil(totalProperties / limit);
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
    | GET BROKER PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */
    async getMyPropertyById(
        brokerId,
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
                seller: brokerId,
                isDeleted: false
            })
                .populate({
                    path: "seller",
                    select: [
                        "fullName",
                        "email",
                        "phone",
                        "whatsappNumber",
                        "profileImage",
                        "brokerProfile"
                    ].join(" ")
                })
                .lean();
        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }
        return property;
    }
}
export default new BrokerPropertyService();