import Property from "../../models/property.model.js";
import Enquiry from "../../models/enquiry.model.js";
import ApiError from "../../utils/api-error.js";

class BrokerAnalyticsService {

    /*
    |--------------------------------------------------------------------------
    | BROKER PROPERTY ANALYTICS
    |--------------------------------------------------------------------------
    */

    async getAnalytics(brokerId) {

        if (!brokerId) {
            throw new ApiError(
                401,
                "Broker authentication required."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | ALL BROKER PROPERTIES
        |--------------------------------------------------------------------------
        */

        const properties = await Property.find({
            seller: brokerId,
            isDeleted: false
        })
            .select([
                "_id",
                "title",
                "propertyType",
                "listingType",
                "price",
                "approval.status",
                "listingStatus",
                "analytics"
            ].join(" "))
            .lean();

        /*
        |--------------------------------------------------------------------------
        | PROPERTY COUNTS
        |--------------------------------------------------------------------------
        */

        const totalProperties =
            properties.length;

        const approvedProperties =
            properties.filter(
                property =>
                    property.approval?.status === "Approved"
            ).length;

        const pendingProperties =
            properties.filter(
                property =>
                    property.approval?.status === "Pending"
            ).length;

        const rejectedProperties =
            properties.filter(
                property =>
                    property.approval?.status === "Rejected"
            ).length;

        const activeProperties =
            properties.filter(
                property =>
                    property.listingStatus === "Active"
            ).length;

        const inactiveProperties =
            properties.filter(
                property =>
                    property.listingStatus === "Inactive"
            ).length;

        /*
        |--------------------------------------------------------------------------
        | ANALYTICS TOTALS
        |--------------------------------------------------------------------------
        */

        const totalViews =
            properties.reduce(
                (total, property) =>
                    total +
                    (property.analytics?.views || 0),
                0
            );

        const totalFavourites =
            properties.reduce(
                (total, property) =>
                    total +
                    (property.analytics?.favourites || 0),
                0
            );

        const totalEnquiries =
            properties.reduce(
                (total, property) =>
                    total +
                    (property.analytics?.enquiries || 0),
                0
            );

        /*
        |--------------------------------------------------------------------------
        | ENQUIRY COUNTS BY STATUS
        |--------------------------------------------------------------------------
        */

        const propertyIds =
            properties.map(
                property => property._id
            );

        const enquiryStats =
            await Enquiry.aggregate([
                {
                    $match: {
                        property: {
                            $in: propertyIds
                        },
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);

        const enquiriesByStatus = {};

        for (const item of enquiryStats) {
            enquiriesByStatus[item._id] =
                item.count;
        }

        return {
            overview: {
                totalProperties,
                approvedProperties,
                pendingProperties,
                rejectedProperties,
                activeProperties,
                inactiveProperties
            },

            engagement: {
                totalViews,
                totalFavourites,
                totalEnquiries
            },

            enquiriesByStatus,

            properties
        };
    }
}

export default new BrokerAnalyticsService();