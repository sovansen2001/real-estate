import User from "../../models/user.model.js";
import ApiError from "../../utils/api-error.js";

class BrokerProfileService {

    /*
    |--------------------------------------------------------------------------
    | GET BROKER PROFILE
    |--------------------------------------------------------------------------
    */

    async getProfile(brokerId) {

        const broker = await User.findOne({
            _id: brokerId,
            role: "Broker",
            isDeleted: false,
            isActive: true
        })
            .select([
                "fullName",
                "email",
                "phone",
                "whatsappNumber",
                "profileImage",
                "address",
                "brokerProfile",
                "notificationPreference",
                "isVerified",
                "createdAt"
            ].join(" "))
            .lean();

        if (!broker) {
            throw new ApiError(
                404,
                "Broker not found."
            );
        }

        return broker;
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE BROKER PROFILE
    |--------------------------------------------------------------------------
    */

    async updateProfile(
        brokerId,
        updateData
    ) {

        const broker = await User.findOne({
            _id: brokerId,
            role: "Broker",
            isDeleted: false,
            isActive: true
        });

        if (!broker) {
            throw new ApiError(
                404,
                "Broker not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | BASIC INFORMATION
        |--------------------------------------------------------------------------
        */

        if (updateData.fullName !== undefined) {
            broker.fullName =
                updateData.fullName.trim();
        }

        if (updateData.phone !== undefined) {
            broker.phone =
                updateData.phone.trim();
        }

        if (updateData.whatsappNumber !== undefined) {
            broker.whatsappNumber =
                updateData.whatsappNumber?.trim() || null;
        }

        /*
        |--------------------------------------------------------------------------
        | ADDRESS
        |--------------------------------------------------------------------------
        */

        if (updateData.address !== undefined) {
            broker.address = {
                ...broker.address?.toObject?.(),
                ...updateData.address
            };
        }

        /*
        |--------------------------------------------------------------------------
        | BROKER PROFILE
        |--------------------------------------------------------------------------
        */

        if (updateData.brokerProfile !== undefined) {

            broker.brokerProfile = {
                ...broker.brokerProfile?.toObject?.(),
                ...updateData.brokerProfile
            };
        }

        /*
        |--------------------------------------------------------------------------
        | NOTIFICATION PREFERENCE
        |--------------------------------------------------------------------------
        */

        if (
            updateData.notificationPreference !== undefined
        ) {

            broker.notificationPreference = {
                ...broker.notificationPreference?.toObject?.(),
                ...updateData.notificationPreference
            };
        }

        await broker.save();

        return await User.findById(brokerId)
            .select([
                "fullName",
                "email",
                "phone",
                "whatsappNumber",
                "profileImage",
                "address",
                "brokerProfile",
                "notificationPreference",
                "isVerified",
                "createdAt",
                "updatedAt"
            ].join(" "))
            .lean();
    }
}

export default new BrokerProfileService();