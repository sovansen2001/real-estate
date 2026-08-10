import mongoose from "mongoose";

import Property360View from "../../models/property-360-view.model.js";
import ApiError from "../../utils/api-error.js";

class Property360ManagementService {

    /*
    |--------------------------------------------------------------------------
    | GET ALL 360° VIEWS FOR ADMIN
    |--------------------------------------------------------------------------
    */

    async getAll360Views(query = {}) {

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

        if (query.status) {
            filter.status = query.status;
        }

        const [views, total] = await Promise.all([

            Property360View.find(filter)
                .populate(
                    "property",
                    "title price location images"
                )
                .populate(
                    "seller",
                    "fullName email phone"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Property360View.countDocuments(filter)

        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            views,

            pagination: {
                total,
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
    | APPROVE 360° VIEW
    |--------------------------------------------------------------------------
    */

    async approve360View(viewId, adminId) {

        if (!mongoose.Types.ObjectId.isValid(viewId)) {
            throw new ApiError(
                400,
                "Invalid 360° view id."
            );
        }

        const view = await Property360View.findOne({
            _id: viewId,
            isDeleted: false
        });

        if (!view) {
            throw new ApiError(
                404,
                "360° view not found."
            );
        }

        if (view.status !== "Pending") {
            throw new ApiError(
                400,
                "Only pending 360° views can be approved."
            );
        }

        view.status = "Approved";
        view.reviewedBy = adminId;
        view.reviewedAt = new Date();
        view.rejectionReason = null;

        await view.save();

        return view;
    }


    /*
    |--------------------------------------------------------------------------
    | REJECT 360° VIEW
    |--------------------------------------------------------------------------
    */

    async reject360View(viewId, adminId, reason) {

        if (!mongoose.Types.ObjectId.isValid(viewId)) {
            throw new ApiError(
                400,
                "Invalid 360° view id."
            );
        }

        if (!reason?.trim()) {
            throw new ApiError(
                400,
                "A rejection reason is required."
            );
        }

        const view = await Property360View.findOne({
            _id: viewId,
            isDeleted: false
        });

        if (!view) {
            throw new ApiError(
                404,
                "360° view not found."
            );
        }

        if (view.status !== "Pending") {
            throw new ApiError(
                400,
                "Only pending 360° views can be rejected."
            );
        }

        view.status = "Rejected";
        view.reviewedBy = adminId;
        view.reviewedAt = new Date();
        view.rejectionReason = reason.trim();

        await view.save();

        return view;
    }
}

export default new Property360ManagementService();