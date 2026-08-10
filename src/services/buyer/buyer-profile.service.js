import User from "../../models/user.model.js";
import ApiError from "../../utils/api-error.js";

class BuyerProfileService {

    /*
    |--------------------------------------------------------------------------
    | GET MY PROFILE
    |--------------------------------------------------------------------------
    */

    async getMyProfile(buyerId) {

        const buyer = await User.findOne({
            _id: buyerId,
            role: "Buyer",
            isDeleted: false
        })
            .select("-password")
            .lean();

        if (!buyer) {
            throw new ApiError(
                404,
                "Buyer profile not found."
            );
        }

        return buyer;
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE MY PROFILE
    |--------------------------------------------------------------------------
    */

    async updateMyProfile(buyerId, data) {

        const allowedFields = [
            "fullName",
            "phone",
            "whatsappNumber",
            "profileImage",
            "address",
            "notificationPreference"
        ];

        const updateData = {};

        for (const field of allowedFields) {

            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }

        }

        const buyer = await User.findOneAndUpdate(
            {
                _id: buyerId,
                role: "Buyer",
                isDeleted: false
            },
            {
                $set: updateData
            },
            {
                new: true,
                runValidators: true
            }
        )
            .select("-password")
            .lean();

        if (!buyer) {
            throw new ApiError(
                404,
                "Buyer profile not found."
            );
        }

        return buyer;
    }
}

export default new BuyerProfileService();