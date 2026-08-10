import User from "../../models/user.model.js";
import Property from "../../models/property.model.js";
import UserManagementService from "./user-management.service.js";
import PropertyManagementService from "./property-management.service.js";

/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD SERVICE
|--------------------------------------------------------------------------
|
| Aggregates a top-level snapshot of the platform for the admin dashboard.
|
|--------------------------------------------------------------------------
*/

class AdminDashboardService {

    async getDashboardOverview() {

        const [
            userStats,
            propertyStats,
            recentUsers,
            propertiesAwaitingReview
        ] = await Promise.all([

            UserManagementService.getUserStatistics(),

            PropertyManagementService.getPropertyStatistics(),

            User.find({ isDeleted: false })
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            Property.find({
                isDeleted: false,
                "approval.status": "Pending"
            })
                .populate("seller", "fullName email phone")
                .sort({ createdAt: 1 })
                .limit(10)
                .lean()

        ]);

        return {
            users: userStats,
            properties: propertyStats,
            recentUsers,
            propertiesAwaitingReview
        };

    }

}

export default new AdminDashboardService();
