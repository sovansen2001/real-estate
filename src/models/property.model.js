import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| PROPERTY MODEL
|------------------------------------------------------------------------
| This model stores every property uploaded by a seller.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| IMAGE SCHEMA
|--------------------------------------------------------------------------
|
| Every uploaded image is stored in Cloudinary.
|
| MongoDB stores only:
|
| - Image URL
| - Cloudinary Public ID
| - Primary Image Flag
|
| Why Embedded?
|
| Images belong only to one property.
| We never need them independently.
|
*/
const imageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true
        },
        publicId: {
            type: String,
            required: true,
            trim: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: true
    }
);

/*
|--------------------------------------------------------------------------
| AREA INFORMATION
|--------------------------------------------------------------------------
| Different countries use different units.
| Example
| 1200 sqft
| 3 acre
| 2 bigha
*/

const areaSchema = new mongoose.Schema(
    {
        value: {
            type: Number,
            required: true,
            min: 1
        },
        unit: {
            type: String,
            enum: [
                "sqft",
                "sqm",
                "acre",
                "bigha",
                "katha",
                "decimal"
            ],
            default: "sqft"
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| PROPERTY LOCATION
|--------------------------------------------------------------------------
|
| Grouping location into one object makes
| searching and future GeoJSON support easier.
|
*/

const locationSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 250
        },

        locality: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80
        },

        state: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80
        },

        country: {
            type: String,
            default: "India",
            trim: true
        },

        pincode: {
            type: String,

            required: true,

            match: [
                /^[1-9][0-9]{5}$/,
                "Invalid Indian pincode."
            ]
        },

        coordinates: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            }
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| PROPERTY SPECIFICATIONS
|--------------------------------------------------------------------------
|
| These fields describe the property itself.
|
| NOTE
| ----
| Validation depends on propertyType.
|
| Example:
|
| Apartment
| ✔ Bedrooms
| ✔ Bathrooms
|
| Plot
| ✘ Bedrooms
| ✘ Bathrooms
|
| Business validation will be implemented
| inside the validator/service layer.
|
*/

const specificationSchema = new mongoose.Schema(
    {
        bedrooms: {
            type: Number,
            min: 0,
            default: null
        },

        bathrooms: {
            type: Number,
            min: 0,
            default: null
        },

        balconies: {
            type: Number,
            min: 0,
            default: null
        },

        parking: {
            type: Number,
            min: 0,
            default: null
        },

        furnishing: {
            type: String,

            enum: [
                "Unfurnished",
                "Semi Furnished",
                "Fully Furnished"
            ],

            default: null
        },

        propertyAge: {
            type: Number,
            min: 0,
            default: null
        },

        floorNumber: {
            type: Number,
            min: 0,
            default: null
        },

        totalFloors: {
            type: Number,
            min: 0,
            default: null
        },

        facing: {
            type: String,

            enum: [
                "North",
                "South",
                "East",
                "West",
                "North-East",
                "North-West",
                "South-East",
                "South-West"
            ],

            default: null
        }
    },
    {
        _id: false
    }
);

/*
|--------------------------------------------------------------------------
| PROPERTY AMENITIES
|--------------------------------------------------------------------------
|
| Example:
|
| Lift
| CCTV
| Garden
| Gym
| Swimming Pool
| Security
|
| Stored as an array because amenities
| change over time and vary by property.
|
*/

const amenitiesSchema = new mongoose.Schema(
    {
        amenities: [
            {
                type: String,
                trim: true,
                maxlength: 60
            }
        ]
    },
    {
        _id: false
    }
);