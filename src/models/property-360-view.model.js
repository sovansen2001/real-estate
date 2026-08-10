import mongoose from "mongoose";

const property360ViewSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
            unique: true,
            index: true
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | 360° TOUR URL
        |--------------------------------------------------------------------------
        */

        tourUrl: {
            type: String,
            required: true,
            trim: true
        },

        /*
        |--------------------------------------------------------------------------
        | APPROVAL WORKFLOW
        |--------------------------------------------------------------------------
        */

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

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        reviewedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
            default: null
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Property360View = mongoose.model(
    "Property360View",
    property360ViewSchema
);

export default Property360View;