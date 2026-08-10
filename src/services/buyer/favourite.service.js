import mongoose from "mongoose";

import Favourite from "../../models/favourite.model.js";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

class FavouriteService {

    /*
    |--------------------------------------------------------------------------
    | ADD PROPERTY TO FAVOURITES
    |--------------------------------------------------------------------------
    */

    async addFavourite(buyerId, propertyId) {

        if (
            !mongoose.Types.ObjectId.isValid(propertyId)
        ) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK PROPERTY
        |--------------------------------------------------------------------------
        */

        const property = await Property.findOne({
            _id: propertyId,
            isDeleted: false,
            "approval.status": "Approved",
            listingStatus: "Active"
        })
            .select("_id")
            .lean();

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK EXISTING FAVOURITE
        |--------------------------------------------------------------------------
        */

        const existingFavourite =
            await Favourite.findOne({
                buyer: buyerId,
                property: propertyId
            });

        if (existingFavourite) {
            throw new ApiError(
                409,
                "Property is already in your favourites."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE FAVOURITE
        |--------------------------------------------------------------------------
        */

        const favourite =
            await Favourite.create({
                buyer: buyerId,
                property: propertyId
            });

        /*
        |--------------------------------------------------------------------------
        | INCREMENT FAVOURITE COUNT
        |--------------------------------------------------------------------------
        */

        await Property.updateOne(
            {
                _id: propertyId
            },
            {
                $inc: {
                    "analytics.favourites": 1
                }
            }
        );

        return favourite;
    }
    async getMyFavourites(buyerId) {
        const favourites = await Favourite.find({
            buyer: buyerId
        })
        .populate({
            path: "property",
            match: {
                isDeleted: false,
                "approval.status": "Approved",
                listingStatus: "Active"
            },
            select: [
                "title",
                "slug",
                "propertyType",
                "listingType",
                "price",
                "currency",
                "area",
                "location",
                "specifications",
                "amenities",
                "images",
                "isFeatured",
                "analytics.views"
            ].join(" ")
        })
        .sort({
            createdAt: -1
        })
        .lean();

        return favourites.filter(
            favourite => favourite.property
        );
    }
}

export default new FavouriteService();