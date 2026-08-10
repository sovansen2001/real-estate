import UserManagementService from "../../services/admin/user-management.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| ADMIN USER MANAGEMENT CONTROLLER
|--------------------------------------------------------------------------
|
| Handles admin requests for managing platform users.
|
| Authentication:
| ---------------
| The acting admin's ID is taken from req.user._id once the
| authentication module is wired in (see requireAdmin middleware).
|
| Business logic:
| ---------------
| All business logic remains inside UserManagementService.
|
|--------------------------------------------------------------------------
*/

class UserManagementController {

    /*
    |--------------------------------------------------------------------------
    | GET ALL USERS
    |--------------------------------------------------------------------------
    */

    async getAllUsers(req, res, next) {

        try {

            const result = await UserManagementService.getAllUsers(req.query);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Users fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET USER STATISTICS
    |--------------------------------------------------------------------------
    */

    async getUserStatistics(req, res, next) {

        try {

            const stats = await UserManagementService.getUserStatistics();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    stats,
                    "User statistics fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET SINGLE USER
    |--------------------------------------------------------------------------
    */

    async getUserById(req, res, next) {

        try {

            const { userId } = req.params;

            const user = await UserManagementService.getUserForAdmin(userId);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    user,
                    "User fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | ACTIVATE / DEACTIVATE USER
    |--------------------------------------------------------------------------
    */

    async setUserActiveStatus(req, res, next) {

        try {

            const { userId } = req.params;
            const { isActive } = req.body;

            // const adminId = req.user._id;
            const adminId = req.user?._id ?? null;

            const user = await UserManagementService.setUserActiveStatus(
                userId,
                Boolean(isActive),
                adminId
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    user,
                    `User ${isActive ? "activated" : "deactivated"} successfully.`
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | CHANGE USER ROLE
    |--------------------------------------------------------------------------
    */

    async changeUserRole(req, res, next) {

        try {

            const { userId } = req.params;
            const { role } = req.body;

            const adminId = req.user?._id ?? null;

            const user = await UserManagementService.changeUserRole(
                userId,
                role,
                adminId
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    user,
                    "User role updated successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | DELETE USER
    |--------------------------------------------------------------------------
    */

    async deleteUser(req, res, next) {

        try {

            const { userId } = req.params;

            const adminId = req.user?._id ?? null;

            await UserManagementService.deleteUser(userId, adminId);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    null,
                    "User deleted successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new UserManagementController();
