import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| ADMIN USER MANAGEMENT SERVICE
|--------------------------------------------------------------------------
|
| Handles all admin-side user management business logic.
|
| Features:
| ✔ List users (pagination, search, role filter, status filter, sorting)
| ✔ Get single user
| ✔ Activate / deactivate a user
| ✔ Change a user's role
| ✔ Soft delete a user
| ✔ Platform-wide user statistics
|
|--------------------------------------------------------------------------
*/

const VALID_ROLES = [
    "Buyer",
    "Seller",
    "Broker",
    "Admin"
];

class UserManagementService {

    /*
    |--------------------------------------------------------------------------
    | GET USER BY ID
    |--------------------------------------------------------------------------
    */

    async getUserForAdmin(userId) {

        if (!mongoose.Types.ObjectId.isValid(userId)) {

            throw new ApiError(
                400,
                "Invalid user id."
            );

        }

        const user = await User.findOne({
            _id: userId,
            isDeleted: false
        }).select("-password");

        if (!user) {

            throw new ApiError(
                404,
                "User not found."
            );

        }

        return user;

    }


    /*
    |--------------------------------------------------------------------------
    | LIST ALL USERS
    |--------------------------------------------------------------------------
    |
    | Features:
    | ✔ Pagination
    | ✔ Search (name, email, phone)
    | ✔ Role Filter
    | ✔ Active / Inactive Filter
    | ✔ Verified Filter
    | ✔ Sorting
    |
    |--------------------------------------------------------------------------
    */

    async getAllUsers(query = {}) {

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


        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if (query.search?.trim()) {

            const search = query.search.trim();

            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ];

        }


        /*
        |--------------------------------------------------------------------------
        | ROLE FILTER
        |--------------------------------------------------------------------------
        */

        if (query.role) {

            if (!VALID_ROLES.includes(query.role)) {

                throw new ApiError(
                    400,
                    "Invalid role filter."
                );

            }

            filter.role = query.role;

        }


        /*
        |--------------------------------------------------------------------------
        | ACTIVE / INACTIVE FILTER
        |--------------------------------------------------------------------------
        */

        if (query.isActive !== undefined) {

            filter.isActive = query.isActive === "true";

        }


        /*
        |--------------------------------------------------------------------------
        | VERIFIED FILTER
        |--------------------------------------------------------------------------
        */

        if (query.isVerified !== undefined) {

            filter.isVerified = query.isVerified === "true";

        }


        /*
        |--------------------------------------------------------------------------
        | SORTING
        |--------------------------------------------------------------------------
        */

        let sort = { createdAt: -1 };

        switch (query.sort) {

            case "oldest":
                sort = { createdAt: 1 };
                break;

            case "nameAsc":
                sort = { fullName: 1 };
                break;

            case "nameDesc":
                sort = { fullName: -1 };
                break;

            default:
                sort = { createdAt: -1 };

        }


        const [users, totalUsers] = await Promise.all([

            User.find(filter)
                .select("-password")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),

            User.countDocuments(filter)

        ]);

        const totalPages = Math.ceil(totalUsers / limit);

        return {

            users,

            pagination: {
                totalUsers,
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
    | ACTIVATE / DEACTIVATE USER
    |--------------------------------------------------------------------------
    |
    | A deactivated user cannot log in (enforced by the auth module) and
    | their properties should not be publicly visible.
    |
    |--------------------------------------------------------------------------
    */

    async setUserActiveStatus(userId, isActive, adminId) {

        const user = await this.getUserForAdmin(userId);

        if (String(user._id) === String(adminId)) {

            throw new ApiError(
                400,
                "You cannot deactivate your own admin account."
            );

        }

        user.isActive = isActive;

        await user.save();

        /*
        |--------------------------------------------------------------------------
        | If a seller is deactivated, pull their active listings off the
        | public site without touching their draft/pending data.
        |--------------------------------------------------------------------------
        */

        if (!isActive && user.role === "Seller") {

            await Property.updateMany(
                {
                    seller: user._id,
                    listingStatus: "Active"
                },
                {
                    $set: { listingStatus: "Inactive" }
                }
            );

        }

        const { password, ...safeUser } = user.toObject();

        return safeUser;

    }


    /*
    |--------------------------------------------------------------------------
    | CHANGE USER ROLE
    |--------------------------------------------------------------------------
    */

    async changeUserRole(userId, newRole, adminId) {

        if (!VALID_ROLES.includes(newRole)) {

            throw new ApiError(
                400,
                "Invalid role."
            );

        }

        const user = await this.getUserForAdmin(userId);

        if (String(user._id) === String(adminId)) {

            throw new ApiError(
                400,
                "You cannot change your own role."
            );

        }

        user.role = newRole;

        await user.save();

        const { password, ...safeUser } = user.toObject();

        return safeUser;

    }


    /*
    |--------------------------------------------------------------------------
    | SOFT DELETE USER
    |--------------------------------------------------------------------------
    */

    async deleteUser(userId, adminId) {

        const user = await this.getUserForAdmin(userId);

        if (String(user._id) === String(adminId)) {

            throw new ApiError(
                400,
                "You cannot delete your own admin account."
            );

        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        user.isActive = false;

        await user.save();

        return true;

    }


    /*
    |--------------------------------------------------------------------------
    | PLATFORM USER STATISTICS
    |--------------------------------------------------------------------------
    */

    async getUserStatistics() {

        const [
            total,
            buyers,
            sellers,
            brokers,
            admins,
            active,
            inactive,
            verified,
            unverified
        ] = await Promise.all([

            User.countDocuments({ isDeleted: false }),
            User.countDocuments({ isDeleted: false, role: "Buyer" }),
            User.countDocuments({ isDeleted: false, role: "Seller" }),
            User.countDocuments({ isDeleted: false, role: "Broker" }),
            User.countDocuments({ isDeleted: false, role: "Admin" }),
            User.countDocuments({ isDeleted: false, isActive: true }),
            User.countDocuments({ isDeleted: false, isActive: false }),
            User.countDocuments({ isDeleted: false, isVerified: true }),
            User.countDocuments({ isDeleted: false, isVerified: false })

        ]);

        return {
            total,
            byRole: { buyers, sellers, brokers, admins },
            active,
            inactive,
            verified,
            unverified
        };

    }

}

export default new UserManagementService();
