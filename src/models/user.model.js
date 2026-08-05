import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| PROFILE IMAGE SCHEMA
|--------------------------------------------------------------------------
*/
const profileImageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            trim: true,
            default: null
        },
        publicId: {
            type: String,
            trim: true,
            default: null
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| ADDRESS SCHEMA
|--------------------------------------------------------------------------
*/
const addressSchema = new mongoose.Schema(
    {
        addressLine: {
            type: String,
            trim: true,
            maxlength: 250,
            default: null
        },
        city: {
            type: String,
            trim: true,
            maxlength: 80,
            default: null
        },
        state: {
            type: String,
            trim: true,
            maxlength: 80,
            default: null
        },
        country: {
            type: String,
            trim: true,
            default: "India"
        },
        pincode: {
            type: String,
            trim: true,
            default: null
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| USER SCHEMA
|--------------------------------------------------------------------------
*/
const userSchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | BASIC INFORMATION
        |--------------------------------------------------------------------------
        */
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 80
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        
        whatsappNumber: {
            type: String,
            default: null
        },

        /*
        |--------------------------------------------------------------------------
        | AUTHENTICATION
        |--------------------------------------------------------------------------
        | Password only.
        | JWT/OTP will be added later.
        */
        password: {
            type: String,
            required: true
        },

        /*
        |--------------------------------------------------------------------------
        | USER ROLE
        |--------------------------------------------------------------------------
        */
        role: {
            type: String,
            enum: [
                "Buyer",
                "Seller",
                "Broker",
                "Admin"
            ],
            required: true,
            default: "Buyer",
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | PROFILE
        |--------------------------------------------------------------------------
        */
        profileImage: {
            type: profileImageSchema,
            default: () => ({})
        },
        address: {
            type: addressSchema,
            default: () => ({})
        },

        brokerProfile: {
            companyName: {
                type: String,
                default: null,
                trim: true
            },
            experience: {
                type: Number,
                default: 0
            },
            reraNumber: {
                type: String,
                default: null,
                trim: true
            },
            about: {
                type: String,
                default: null,
                maxlength: 1000
            }
        },
        
        notificationPreference: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            }
        },

        /*
        |--------------------------------------------------------------------------
        | ACCOUNT STATUS
        |--------------------------------------------------------------------------
        */
        isVerified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },

        /*
        |--------------------------------------------------------------------------
        | LOGIN INFO
        |--------------------------------------------------------------------------
        */
        lastLogin: {
            type: Date,
            default: null
        },

        /*
        |--------------------------------------------------------------------------
        | SOFT DELETE
        |--------------------------------------------------------------------------
        */
        isDeleted: {
            type: Boolean,
            default: false
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

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/
userSchema.index({
    role: 1,
    isActive: 1
});
userSchema.index({
    fullName: "text",
    email: "text"
});
const User = mongoose.model("User", userSchema);
export default User;