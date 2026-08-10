import User from "../../models/user.model.js";
import Property from "../../models/property.model.js";
import Enquiry from "../../models/enquiry.model.js";
import Favourite from "../../models/favourite.model.js";
import RecentlyViewed from "../../models/recently-viewed.model.js";
import ApiError from "../../utils/api-error.js";

class BuyerDashboardService {

    /*
    |--------------------------------------------------------------------------
    | GET BUYER DASHBOARD
    |--------------------------------------------------------------------------
    */

    async getDashboard(buyerId) {

        if (!buyerId) {
            throw new ApiError(
                401,
                "Buyer authentication required."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | BUYER
        |--------------------------------------------------------------------------
        */

        const buyer = await User.findOne({
            _id: buyerId,
            role: "Buyer",
            isDeleted: false,
            isActive: true
        })
            .select(
                "fullName email phone whatsappNumber profileImage address"
            )
            .lean();

        if (!buyer) {
            throw new ApiError(
                404,
                "Buyer not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | COUNTS
        |--------------------------------------------------------------------------
        */

        const [
            favouriteCount,
            enquiryCount,
            recentlyViewedCount
        ] = await Promise.all([

            Favourite.countDocuments({
                buyer: buyerId
            }),

            Enquiry.countDocuments({
                user: buyerId,
                isDeleted: false
            }),

            RecentlyViewed.countDocuments({
                buyer: buyerId
            })

        ]);

        /*
        |--------------------------------------------------------------------------
        | RECENT FAVOURITES
        |--------------------------------------------------------------------------
        */

        const recentFavourites = await Favourite.find({
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
                    "images",
                    "isFeatured"
                ].join(" ")
            })
            .sort({
                createdAt: -1
            })
            .limit(5)
            .lean();

        /*
        |--------------------------------------------------------------------------
        | REMOVE FAVOURITES WHOSE PROPERTY IS NO LONGER PUBLIC
        |--------------------------------------------------------------------------
        */

        const validRecentFavourites =
            recentFavourites.filter(
                favourite => favourite.property
            );

        /*
        |--------------------------------------------------------------------------
        | RECENT ENQUIRIES
        |--------------------------------------------------------------------------
        */

        const recentEnquiries = await Enquiry.find({
            user: buyerId,
            isDeleted: false
        })
            .populate({
                path: "property",
                select: [
                    "title",
                    "propertyType",
                    "listingType",
                    "price",
                    "currency",
                    "images",
                    "location"
                ].join(" ")
            })
            .sort({
                createdAt: -1
            })
            .limit(5)
            .lean();

        /*
        |--------------------------------------------------------------------------
        | RECENTLY VIEWED
        |--------------------------------------------------------------------------
        */

        const recentlyViewed = await RecentlyViewed.find({
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
                    "images",
                    "isFeatured"
                ].join(" ")
            })
            .sort({
                viewedAt: -1
            })
            .limit(5)
            .lean();

        const validRecentlyViewed =
            recentlyViewed.filter(
                item => item.property
            );

        /*
        |--------------------------------------------------------------------------
        | ACTIVITY SUMMARY
        |--------------------------------------------------------------------------
        */

        const activity = {
            totalFavourites: favouriteCount,
            totalEnquiries: enquiryCount,
            totalRecentlyViewed: recentlyViewedCount
        };

        /*
        |--------------------------------------------------------------------------
        | FINAL RESPONSE
        |--------------------------------------------------------------------------
        */

        return {

            buyer,

            overview: {
                favouriteCount,
                enquiryCount,
                recentlyViewedCount
            },

            recentFavourites:
                validRecentFavourites,

            recentEnquiries,

            recentlyViewed:
                validRecentlyViewed,

            activity

        };
    }
}

export default new BuyerDashboardService();