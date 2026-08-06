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
            approvalStatus: "Approved"
        })
            .sort({
                createdAt: -1
            })
            .limit(limit)
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
            approvalStatus: "Approved"
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