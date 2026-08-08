import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | PROPERTY
        |--------------------------------------------------------------------------
        | The property for which the enquiry was submitted.
        |--------------------------------------------------------------------------
        */
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | USER
        |--------------------------------------------------------------------------
        | Optional because a public visitor may enquire without logging in.
        |--------------------------------------------------------------------------
        */
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | VISITOR / CUSTOMER DETAILS
        |--------------------------------------------------------------------------
        */
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 150
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },

        message: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ""
        },

        /*
        |--------------------------------------------------------------------------
        | ENQUIRY STATUS
        |--------------------------------------------------------------------------
        */
        status: {
            type: String,
            enum: [
                "New",
                "Contacted",
                "In Progress",
                "Closed"
            ],
            default: "New",
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | SOFT DELETE
        |--------------------------------------------------------------------------
        */
        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Enquiry = mongoose.model(
    "Enquiry",
    enquirySchema
);

export default Enquiry;