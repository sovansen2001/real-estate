import { Router } from "express";

import SellerProfileController from "../../controllers/seller/seller-profile.controller.js";

// Authentication middleware
// import { verifySeller } from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| SELLER PROFILE ROUTES
|--------------------------------------------------------------------------
| Authentication will be enabled after the authentication
| module is completed.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET SELLER PROFILE
|--------------------------------------------------------------------------
*/
router.get(
    "/:sellerId",

    // verifySeller,

    SellerProfileController.getSellerProfile
);

/*
|--------------------------------------------------------------------------
| UPDATE SELLER PROFILE
|--------------------------------------------------------------------------
*/
router.put(
    "/:sellerId",

    // verifySeller,

    SellerProfileController.updateSellerProfile
);

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE IMAGE
|--------------------------------------------------------------------------
*/
router.patch(
    "/:sellerId/profile-image",

    // verifySeller,

    upload.single("profileImage"),

    SellerProfileController.updateProfileImage
);

export default router;