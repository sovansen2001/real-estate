import mongoose from "mongoose";

import Property from "../../models/property.model.js";
import RecentlyViewed from "../../models/recently-viewed.model.js";
import ApiError from "../../utils/api-error.js";

class PropertyDetailsService {

    async getPropertyDetails(propertyId, buyerId = null) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | FIND PUBLIC PROPERTY
        |--------------------------------------------------------------------------
        */

        const property = await Property.findOne({
            _id: propertyId,
            isDeleted: false,
            "approval.status": "Approved",
            listingStatus: "Active"
        })
            .populate(
                "seller",
                "fullName email phone whatsappNumber profileImage brokerProfile"
            )
            .lean();

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | INCREMENT VIEW COUNT
        |--------------------------------------------------------------------------
        */

        await Property.updateOne(
            {
                _id: propertyId
            },
            {
                $inc: {
                    "analytics.views": 1
                }
            }
        );

        /*
        |--------------------------------------------------------------------------
        | RECORD BUYER'S RECENTLY VIEWED PROPERTY
        |--------------------------------------------------------------------------
        |
        | Only authenticated buyers get a history record.
        |
        |--------------------------------------------------------------------------
        */

        if (buyerId) {

            await RecentlyViewed.findOneAndUpdate(

                {
                    buyer: buyerId,
                    property: propertyId
                },

                {
                    $set: {
                        viewedAt: new Date()
                    }
                },

                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }

            );
        }

        /*
        |--------------------------------------------------------------------------
        | RETURN UPDATED VIEW COUNT
        |--------------------------------------------------------------------------
        */

        property.analytics.views =
            (property.analytics?.views || 0) + 1;

        return property;
    }
}

export default new PropertyDetailsService();