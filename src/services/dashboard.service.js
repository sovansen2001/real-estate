import mongoose from "mongoose";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| Seller Dashboard Service
|--------------------------------------------------------------------------
| Business logic for Seller Dashboard.
|--------------------------------------------------------------------------
*/
class DashboardService {
    /*
    |--------------------------------------------------------------------------
    | Dashboard Statistics
    |--------------------------------------------------------------------------
    */
    async getDashboardStats(sellerId) {
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            throw new ApiError(400, "Invalid seller id.");
        }
        const [
            totalProperties,
            draftProperties,
            pendingProperties,
            approvedProperties,
            rejectedProperties,
            activeProperties,
            inactiveProperties,
            soldProperties,
            rentedProperties
        ] = await Promise.all([
            Property.countDocuments({
                seller: sellerId,
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Draft",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Pending",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Approved",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                "approval.status": "Rejected",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Active",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Inactive",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Sold",
                isDeleted: false
            }),
            Property.countDocuments({
                seller: sellerId,
                listingStatus: "Rented",
                isDeleted: false
            })
        ]);

        const analytics = await Property.aggregate([
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(sellerId),
                    isDeleted: false
                }
            },

            {
                $group: {
                    _id: null,
                    totalViews: {
                        $sum: "$analytics.views"
                    },
                    totalEnquiries: {
                        $sum: "$analytics.enquiries"
                    },
                    totalFavourites: {
                        $sum: "$analytics.favourites"
                    }
                }
            }
        ]);

        return {
            statistics: {
                totalProperties,
                draftProperties,
                pendingProperties,
                approvedProperties,
                rejectedProperties,
                activeProperties,
                inactiveProperties,
                soldProperties,
                rentedProperties
            },

            analytics: {
                totalViews: analytics[0]?.totalViews || 0,
                totalEnquiries: analytics[0]?.totalEnquiries || 0,
                totalFavourites: analytics[0]?.totalFavourites || 0
            }
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Recent Properties
    |--------------------------------------------------------------------------
    */
    async getRecentProperties(sellerId) {
        return await Property.find({
            seller: sellerId,
            isDeleted: false
        })
            .select(
                "title price listingStatus approval images createdAt location.city location.state"
            )
            .sort({
                createdAt: -1
            })
            .limit(5)
            .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | Top Viewed Properties
    |--------------------------------------------------------------------------
    */
    async getTopViewedProperties(sellerId) {
        return await Property.find({
            seller: sellerId,
            isDeleted: false
        })

            .select(
                "title price analytics.views listingStatus"
            )
            .sort({
                "analytics.views": -1
            })
            .limit(5)
            .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | Monthly Property Statistics
    |--------------------------------------------------------------------------
    */
    async getMonthlyStatistics(sellerId) {
        return await Property.aggregate([
            {
                $match: {
                    seller: new mongoose.Types.ObjectId(sellerId),
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    totalProperties: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);
    }
}
export default new DashboardService();