import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | CUSTOMER INFORMATION
        |--------------------------------------------------------------------------
        */

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 150,
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | CONTACT SUBJECT
        |--------------------------------------------------------------------------
        */

        subject: {
            type: String,
            required: true,
            enum: [
                "Find a Property",
                "List my Property",
                "Request 360° Tour",
                "Broker Enquiry",
                "Other"
            ],
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | SERVICE
        |--------------------------------------------------------------------------
        |
        | Used when the user arrives from:
        | services.html?service=...
        |
        |--------------------------------------------------------------------------
        */

        service: {
            type: String,
            trim: true,
            maxlength: 100,
            default: null
        },

        /*
        |--------------------------------------------------------------------------
        | MESSAGE
        |--------------------------------------------------------------------------
        */

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 2000
        },

        /*
        |--------------------------------------------------------------------------
        | CONTACT STATUS
        |--------------------------------------------------------------------------
        */

        status: {
            type: String,
            enum: [
                "New",
                "In Progress",
                "Resolved",
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
        timestamps: true,
        versionKey: false
    }
);

contactSchema.index({
    createdAt: -1
});

contactSchema.index({
    status: 1,
    createdAt: -1
});

const Contact = mongoose.model(
    "Contact",
    contactSchema
);

export default Contact;