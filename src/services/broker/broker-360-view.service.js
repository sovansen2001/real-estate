import mongoose from "mongoose";

import Property from "../../models/property.model.js";
import Property360View from "../../models/property-360-view.model.js";
import ApiError from "../../utils/api-error.js";

class Broker360ViewService {

    /*
    |--------------------------------------------------------------------------
    | SUBMIT 360° VIEW
    |--------------------------------------------------------------------------
    */

    async submit360View(
        brokerId,
        propertyId,
        tourUrl
    ) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        if (!tourUrl || !tourUrl.trim()) {
            throw new ApiError(
                400,
                "360° tour URL is required."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | PROPERTY MUST BELONG TO BROKER
        |--------------------------------------------------------------------------
        */

        const property = await Property.findOne({
            _id: propertyId,
            seller: brokerId,
            isDeleted: false
        })
            .select("_id seller")
            .lean();

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK EXISTING 360° VIEW
        |--------------------------------------------------------------------------
        */

        const existingView =
            await Property360View.findOne({
                property: propertyId,
                isDeleted: false
            });

        /*
        |--------------------------------------------------------------------------
        | UPDATE EXISTING
        |--------------------------------------------------------------------------
        */

        if (existingView) {

            existingView.tourUrl =
                tourUrl.trim();

            existingView.status = "Pending";
            existingView.reviewedBy = null;
            existingView.reviewedAt = null;
            existingView.rejectionReason = null;

            await existingView.save();

            return existingView;
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE NEW
        |--------------------------------------------------------------------------
        */

        const view = await Property360View.create({

            property: propertyId,

            seller: brokerId,

            tourUrl: tourUrl.trim(),

            status: "Pending"

        });

        return view;
    }


    /*
    |--------------------------------------------------------------------------
    | GET MY 360° VIEWS
    |--------------------------------------------------------------------------
    */

    async getMy360Views(brokerId) {

        const views =
            await Property360View.find({
                seller: brokerId,
                isDeleted: false
            })
                .populate({
                    path: "property",
                    select: [
                        "title",
                        "slug",
                        "propertyType",
                        "listingType",
                        "price",
                        "location"
                    ].join(" ")
                })
                .sort({
                    createdAt: -1
                })
                .lean();

        return views;
    }
}

export default new Broker360ViewService();