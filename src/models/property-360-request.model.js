import mongoose from "mongoose";

const property360RequestSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
            index: true
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected"
            ],
            default: "Pending",
            index: true
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        reviewedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/*
|--------------------------------------------------------------------------
| ONE 360° ACCESS REQUEST PER BUYER + PROPERTY
|--------------------------------------------------------------------------
*/

property360RequestSchema.index(
    {
        buyer: 1,
        property: 1
    },
    {
        unique: true
    }
);

const Property360Request = mongoose.model(
    "Property360Request",
    property360RequestSchema
);

export default Property360Request;