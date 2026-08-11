import User from "../../models/user.model.js";
import Property from "../../models/property.model.js";
import Enquiry from "../../models/enquiry.model.js";
import ApiError from "../../utils/api-error.js";

class BrokerDashboardService {

    async getDashboard(brokerId) {

        if (!brokerId) {
            throw new ApiError(
                401,
                "Broker authentication required."
            );
        }

        const broker = await User.findOne({
            _id: brokerId,
            role: "Broker",
            isDeleted: false,
            isActive: true
        })
            .select(
                "fullName email phone whatsappNumber profileImage address brokerProfile"
            )
            .lean();

        if (!broker) {
            throw new ApiError(
                404,
                "Broker not found."
            );
        }

        const propertyFilter = {
            seller: brokerId,
            isDeleted: false
        };

        const [
            totalProperties,
            activeProperties,
            pendingProperties,
            soldProperties,
            rentedProperties,
            totalViews,
            totalEnquiries,
            totalFavourites
        ] = await Promise.all([

            Property.countDocuments(propertyFilter),
            Property.countDocuments({
                ...propertyFilter,
                listingStatus: "Active"
            }),
            Property.countDocuments({
                ...propertyFilter,
                "approval.status": "Pending"
            }),
            Property.countDocuments({
                ...propertyFilter,
                listingStatus: "Sold"
            }),
            Property.countDocuments({
                ...propertyFilter,
                listingStatus: "Rented"
            }),
            Property.aggregate([
                {
                    $match: propertyFilter
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$analytics.views"
                        }
                    }
                }
            ]),
            Enquiry.countDocuments({
                isDeleted: false,
                property: {
                    $in: await Property.find(
                        propertyFilter
                    ).distinct("_id")
                }
            }),
            Property.aggregate([
                {
                    $match: propertyFilter
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$analytics.favourites"
                        }
                    }
                }
            ])
        ]);

        return {
            broker,
            overview: {
                totalProperties,
                activeProperties,
                pendingProperties,
                soldProperties,
                rentedProperties,
                totalViews:
                    totalViews[0]?.total || 0,
                totalEnquiries,
                totalFavourites:
                    totalFavourites[0]?.total || 0
            }

        };
    }
}
export default new BrokerDashboardService();