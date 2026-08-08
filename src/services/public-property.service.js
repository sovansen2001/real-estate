import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| PUBLIC PROPERTY SERVICE
|--------------------------------------------------------------------------
| Business logic for public property APIs.
|--------------------------------------------------------------------------
*/
class PublicPropertyService {

    /*
    |--------------------------------------------------------------------------
    | GET FEATURED PROPERTIES
    |--------------------------------------------------------------------------
    */
    async getFeaturedProperties(limit = 8) {

    return await Property.find({

        isDeleted: false,

        listingStatus: "Active",

        "approval.status": "Approved",

        isFeatured: true

    })
        .sort({
            createdAt: -1
        })
        .limit(limit)
        .lean();
}
    
    /*
    |--------------------------------------------------------------------------
    | GET LATEST PROPERTIES
    |--------------------------------------------------------------------------
    */
    async getLatestProperties(limit = 12) {
        return await Property.find({
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved"
        })
        .sort({
            createdAt: -1
        })
        .limit(limit)
        .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH & FILTER PROPERTIES
    |--------------------------------------------------------------------------
    */
    async searchProperties(filters) {
        const query = {
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved"
        };

        /*
        |--------------------------------------------------------------------------
        | Search by Keyword
        |--------------------------------------------------------------------------
        */
        if (filters.keyword) {
            query.$or = [
                {
                    title: {
                        $regex: filters.keyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: filters.keyword,
                        $options: "i"
                    }
                }
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Listing Type
        |--------------------------------------------------------------------------
        */
        if (filters.listingType) {
            query.listingType = filters.listingType;
        }

        /*
        |--------------------------------------------------------------------------
        | Property Type
        |--------------------------------------------------------------------------
        */
        if (filters.propertyType) {
            query.propertyType = filters.propertyType;
        }

        /*
        |--------------------------------------------------------------------------
        | City
        |--------------------------------------------------------------------------
        */
        if (filters.city) {
            query["location.city"] = filters.city;
        }

        /*
        |--------------------------------------------------------------------------
        | State
        |--------------------------------------------------------------------------
        */
        if (filters.state) {
            query["location.state"] = filters.state;
        }

        /*
        |--------------------------------------------------------------------------
        | Price Range
        |--------------------------------------------------------------------------
        */
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) {
                query.price.$gte = Number(filters.minPrice);
            }
            if (filters.maxPrice) {
                query.price.$lte = Number(filters.maxPrice);
            }
        }
        return await Property.find(query)
        .sort({
            createdAt: -1
        })
        .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */
    async getPropertyDetails(propertyId) {
        const property = await Property.findOne({
            _id: propertyId,
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved"
        }).lean();

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }
        return property;
    }
}
export default new PublicPropertyService();