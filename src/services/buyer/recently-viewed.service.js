import RecentlyViewed from "../../models/recently-viewed.model.js";
import ApiError from "../../utils/api-error.js";

class RecentlyViewedService {

    async getRecentlyViewed(buyerId) {

        const history = await RecentlyViewed.find({
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
                    "images",
                    "isFeatured",
                    "analytics.views"
                ].join(" ")
            })
            .sort({
                viewedAt: -1
            })
            .limit(20)
            .lean();

        return history.filter(
            item => item.property
        );
    }

    async clearRecentlyViewed(buyerId) {

        await RecentlyViewed.deleteMany({
            buyer: buyerId
        });

        return true;
    }
}

export default new RecentlyViewedService();