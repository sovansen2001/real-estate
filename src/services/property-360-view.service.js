import mongoose from "mongoose";

import Property360View from "../models/property-360-view.model.js";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

class Property360ViewService {

    /*
    |--------------------------------------------------------------------------
    | CREATE / SUBMIT 360° VIEW
    |--------------------------------------------------------------------------
    */

    async create360View(sellerId, propertyId, tourUrl) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(400, "Invalid property id.");
        }

        if (!tourUrl?.trim()) {
            throw new ApiError(400, "360° tour URL is required.");
        }

        const property = await Property.findOne({
            _id: propertyId,
            seller: sellerId,
            isDeleted: false
        }).select("_id");

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        const existingView = await Property360View.findOne({
            property: propertyId,
            isDeleted: false
        });

        if (existingView) {
            throw new ApiError(
                409,
                "360° view already exists for this property."
            );
        }

        return await Property360View.create({
            property: propertyId,
            seller: sellerId,
            tourUrl: tourUrl.trim(),
            status: "Pending"
        });
    }


    /*
    |--------------------------------------------------------------------------
    | GET SELLER 360° VIEW
    |--------------------------------------------------------------------------
    */

    async getSeller360View(sellerId, propertyId) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(400, "Invalid property id.");
        }

        const view = await Property360View.findOne({
            property: propertyId,
            seller: sellerId,
            isDeleted: false
        }).lean();

        if (!view) {
            throw new ApiError(
                404,
                "360° view not found."
            );
        }

        return view;
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE 360° VIEW
    |--------------------------------------------------------------------------
    */

    async delete360View(sellerId, propertyId) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(400, "Invalid property id.");
        }

        const view = await Property360View.findOne({
            property: propertyId,
            seller: sellerId,
            isDeleted: false
        });

        if (!view) {
            throw new ApiError(
                404,
                "360° view not found."
            );
        }

        view.isDeleted = true;

        await view.save();

        return true;
    }
}

export default new Property360ViewService();