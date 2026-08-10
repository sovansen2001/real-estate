import { Router } from "express";

import UserManagementController from "../../controllers/admin/user-management.controller.js";
import validate from "../../middleware/validate.middleware.js";
import {
    setUserActiveStatusSchema,
    changeUserRoleSchema
} from "../../validators/admin.validator.js";

// Authentication middleware
// Use the authentication middleware created by your senior, then requireAdmin.
// import { verifyJWT } from "../../middleware/auth.middleware.js";
// import { requireAdmin } from "../../middleware/admin.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN USER MANAGEMENT ROUTES
|--------------------------------------------------------------------------
|
| Base Route: /api/v1/admin/users
|
| Every route here should eventually be:
|   verifyJWT, requireAdmin, <controller>
|
|--------------------------------------------------------------------------
*/

// Get All Users
router.get(
    "/",
    // verifyJWT,
    // requireAdmin,
    UserManagementController.getAllUsers
);

// User Statistics
router.get(
    "/statistics",
    // verifyJWT,
    // requireAdmin,
    UserManagementController.getUserStatistics
);

// Get Single User
router.get(
    "/:userId",
    // verifyJWT,
    // requireAdmin,
    UserManagementController.getUserById
);

// Activate / Deactivate User
router.patch(
    "/:userId/status",
    // verifyJWT,
    // requireAdmin,
    validate(setUserActiveStatusSchema),
    UserManagementController.setUserActiveStatus
);

// Change User Role
router.patch(
    "/:userId/role",
    // verifyJWT,
    // requireAdmin,
    validate(changeUserRoleSchema),
    UserManagementController.changeUserRole
);

// Delete User
router.delete(
    "/:userId",
    // verifyJWT,
    // requireAdmin,
    UserManagementController.deleteUser
);

export default router;
