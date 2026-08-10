import mongoose from "mongoose";

import Property360Request from "../../models/property-360-request.model.js";
import Property360View from "../../models/property-360-view.model.js";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

class Property360RequestService {

    /*
    |--------------------------------------------------------------------------
    | REQUEST 360° ACCESS
    |--------------------------------------------------------------------------
    */

    async requestAccess(buyerId, propertyId) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | PROPERTY MUST BE PUBLIC
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
        | 360° TOUR MUST EXIST AND BE APPROVED
        |--------------------------------------------------------------------------
        */

        const tour = await Property360View.findOne({
            property: propertyId,
            status: "Approved",
            isDeleted: false
        })
            .select("_id")
            .lean();

        if (!tour) {
            throw new ApiError(
                404,
                "Approved 360° view is not available for this property."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CHECK EXISTING REQUEST
        |--------------------------------------------------------------------------
        */

        const existingRequest =
            await Property360Request.findOne({
                buyer: buyerId,
                property: propertyId
            });

        if (existingRequest) {

            if (existingRequest.status === "Approved") {
                throw new ApiError(
                    409,
                    "You already have access to this 360° view."
                );
            }

            if (existingRequest.status === "Pending") {
                throw new ApiError(
                    409,
                    "Your 360° access request is already pending."
                );
            }

            /*
            |------------------------------------------------------------------
            | REJECTED REQUEST
            |------------------------------------------------------------------
            | Allow buyer to request access again.
            |------------------------------------------------------------------
            */

            existingRequest.status = "Pending";
            existingRequest.rejectionReason = null;
            existingRequest.reviewedBy = null;
            existingRequest.reviewedAt = null;

            await existingRequest.save();

            return existingRequest;
        }

        /*
        |--------------------------------------------------------------------------
        | CREATE REQUEST
        |--------------------------------------------------------------------------
        */

        return await Property360Request.create({
            buyer: buyerId,
            property: propertyId,
            status: "Pending"
        });
    }


    /*
    |--------------------------------------------------------------------------
    | GET MY 360° REQUESTS
    |--------------------------------------------------------------------------
    */

    async getMyRequests(buyerId) {

        const requests =
            await Property360Request.find({
                buyer: buyerId
            })
                .populate({
                    path: "property",
                    select: [
                        "title",
                        "propertyType",
                        "listingType",
                        "price",
                        "location",
                        "images"
                    ].join(" ")
                })
                .sort({
                    createdAt: -1
                })
                .lean();

        return requests;
    }


    /*
    |--------------------------------------------------------------------------
    | ACCESS APPROVED 360° VIEW
    |--------------------------------------------------------------------------
    */

    async getApprovedView(
        buyerId,
        propertyId
    ) {

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | BUYER MUST HAVE APPROVED ACCESS
        |--------------------------------------------------------------------------
        */

        const request =
            await Property360Request.findOne({
                buyer: buyerId,
                property: propertyId,
                status: "Approved"
            })
                .lean();

        if (!request) {
            throw new ApiError(
                403,
                "You do not have approved access to this 360° view."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | TOUR MUST STILL BE APPROVED
        |--------------------------------------------------------------------------
        */

        const tour =
            await Property360View.findOne({
                property: propertyId,
                status: "Approved",
                isDeleted: false
            })
                .select("property seller tourUrl")
                .populate(
                    "seller",
                    "fullName email phone"
                )
                .lean();

        if (!tour) {
            throw new ApiError(
                404,
                "360° view is no longer available."
            );
        }

        return tour;
    }
}

export default new Property360RequestService();