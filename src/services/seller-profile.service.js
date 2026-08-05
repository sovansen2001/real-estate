import mongoose from "mongoose";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| SELLER PROFILE SERVICE
|--------------------------------------------------------------------------
| Handles all seller profile business logic.
|--------------------------------------------------------------------------
*/

class SellerProfileService {

    /*
    |--------------------------------------------------------------------------
    | Get Seller Profile
    |--------------------------------------------------------------------------
    */

    async getSellerProfile(sellerId) {

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            throw new ApiError(400, "Invalid seller id.");
        }

        const seller = await User.findOne({
            _id: sellerId,
            role: "Seller",
            isDeleted: false
        })
            .select("-password")
            .lean();

        if (!seller) {
            throw new ApiError(404, "Seller not found.");
        }

        return seller;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Seller Profile
    |--------------------------------------------------------------------------
    */

    async updateSellerProfile(sellerId, payload) {

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            throw new ApiError(400, "Invalid seller id.");
        }

        const allowedFields = {
            fullName: payload.fullName,
            phone: payload.phone,
            whatsappNumber: payload.whatsappNumber,

            address: payload.address,

            brokerProfile: payload.brokerProfile
        };

        const seller = await User.findOneAndUpdate(
            {
                _id: sellerId,
                role: "Seller",
                isDeleted: false
            },
            {
                $set: allowedFields
            },
            {
                new: true,
                runValidators: true
            }
        )
            .select("-password");

        if (!seller) {
            throw new ApiError(404, "Seller not found.");
        }

        return seller;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Profile Image
    |--------------------------------------------------------------------------
    */

    async updateProfileImage(
        sellerId,
        imageUrl,
        publicId
    ) {

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            throw new ApiError(400, "Invalid seller id.");
        }

        const seller = await User.findOneAndUpdate(
            {
                _id: sellerId,
                role: "Seller",
                isDeleted: false
            },
            {
                $set: {
                    profileImage: {
                        url: imageUrl,
                        publicId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
            .select("-password");

        if (!seller) {
            throw new ApiError(404, "Seller not found.");
        }

        return seller;
    }

}

export default new SellerProfileService();