import SellerProfileService from "../../services/seller-profile.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| SELLER PROFILE CONTROLLER
|--------------------------------------------------------------------------
| Handles seller profile requests.
|--------------------------------------------------------------------------
*/

class SellerProfileController {

    /*
    |--------------------------------------------------------------------------
    | GET SELLER PROFILE
    |--------------------------------------------------------------------------
    */

    async getSellerProfile(req, res, next) {
        try {

            // After authentication:
            // const sellerId = req.user._id;

            const { sellerId } = req.params;

            const seller =
                await SellerProfileService.getSellerProfile(
                    sellerId
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    seller,
                    "Seller profile fetched successfully."
                )
            );

        } catch (error) {
            next(error);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE SELLER PROFILE
    |--------------------------------------------------------------------------
    */

    async updateSellerProfile(req, res, next) {
        try {

            // After authentication:
            // const sellerId = req.user._id;

            const { sellerId } = req.params;

            const seller =
                await SellerProfileService.updateSellerProfile(
                    sellerId,
                    req.body
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    seller,
                    "Seller profile updated successfully."
                )
            );

        } catch (error) {
            next(error);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PROFILE IMAGE
    |--------------------------------------------------------------------------
    */

    async updateProfileImage(req, res, next) {
        try {

            // After authentication:
            // const sellerId = req.user._id;

            const { sellerId } = req.params;

            if (!req.file) {
                throw new Error("Profile image is required.");
            }

            const seller =
                await SellerProfileService.updateProfileImage(
                    sellerId,
                    req.file.path,
                    req.file.filename
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    seller,
                    "Profile image updated successfully."
                )
            );

        } catch (error) {
            next(error);
        }
    }

}

export default new SellerProfileController();