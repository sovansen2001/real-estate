import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| PROPERTY MODEL
|------------------------------------------------------------------------
| This model stores every property uploaded by a seller.
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| IMAGE SCHEMA
|--------------------------------------------------------------------------
| Every uploaded image is stored in Cloudinary.
| MongoDB stores only:
| - Image URL
| - Cloudinary Public ID
| - Primary Image Flag
| Why Embedded?
| Images belong only to one property.
| We never need them independently.
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
| Grouping location into one object makes
| searching and future GeoJSON support easier.
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
        geoLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                index: "2dsphere"
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
| These fields describe the property itself.
| NOTE
| ----
| Validation depends on propertyType.
| Example:
| Apartment
| ✔ Bedrooms
| ✔ Bathrooms
| Plot
| ✘ Bedrooms
| ✘ Bathrooms
| Business validation will be implemented
| inside the validator/service layer.
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
| Example:
| Lift
| CCTV
| Garden
| Gym
| Swimming Pool
| Security
| Stored as an array because amenities
| change over time and vary by property.
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

/*
|--------------------------------------------------------------------------
| PROPERTY SCHEMA
|--------------------------------------------------------------------------
|
| This is the main schema that combines all reusable sub-schemas.
|
| Every property belongs to exactly one seller.
|
*/

const propertySchema = new mongoose.Schema(
    {
        /*
        |--------------------------------------------------------------------------
        | PROPERTY OWNER
        |--------------------------------------------------------------------------
        */
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | BASIC INFORMATION
        |--------------------------------------------------------------------------
        */
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 120
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 50,
            maxlength: 5000
        },
        propertyType: {
            type: String,
            required: true,
            enum: [
                "Apartment",
                "Flat",
                "Villa",
                "House",
                "Plot",
                "Farm House",
                "Office",
                "Shop",
                "Warehouse",
                "Commercial Land"
            ],
            index: true
        },

        listingType: {
            type: String,
            required: true,
            enum: [
                "Sell",
                "Rent"
            ],
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | PRICE INFORMATION
        |--------------------------------------------------------------------------
        */
        price: {
            type: Number,
            required: true,
            min: 1,
            index: true
        },
        negotiable: {
            type: Boolean,
            default: false
        },
        currency: {
            type: String,
            default: "INR"
        },

        /*
        |--------------------------------------------------------------------------
        | PROPERTY DETAILS
        |--------------------------------------------------------------------------
        */
        area: areaSchema,
        location: locationSchema,
        specifications: specificationSchema,
        amenities: amenitiesSchema,

        /*
        |--------------------------------------------------------------------------
        | PROPERTY IMAGES
        |--------------------------------------------------------------------------
        */
        images: {
            type: [imageSchema],
            default: []
        },

        /*
        |--------------------------------------------------------------------------
        | APPROVAL WORKFLOW
        |--------------------------------------------------------------------------
        | Seller CANNOT update this section.
        | Only Admin APIs will update it.
        */
        approval: {
            status: {
                type: String,
                enum: [
                    "Draft",
                    "Pending",
                    "Approved",
                    "Rejected"
                ],
                default: "Draft",
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
                default: null,
                maxlength: 500
            }
        },

        /*
        |--------------------------------------------------------------------------
        | LISTING STATUS
        |--------------------------------------------------------------------------
        | Seller can activate/deactivate
        | after approval.
        */
        listingStatus: {
            type: String,
            enum: [
                "Active",
                "Inactive",
                "Sold",
                "Rented"
            ],
            default: "Inactive",
            index: true
        },

        /*
        |--------------------------------------------------------------------------
        | PROPERTY VISIBILITY
        |--------------------------------------------------------------------------
        */
        isFeatured: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },

        /*
        |--------------------------------------------------------------------------
        | ANALYTICS
        |--------------------------------------------------------------------------
        */
        analytics: {
            views: {
                type: Number,
                default: 0
            },
            enquiries: {
                type: Number,
                default: 0
            },

            favourites: {
                type: Number,
                default: 0
            }
        },

        /*
        |--------------------------------------------------------------------------
        | SEO
        |--------------------------------------------------------------------------
        */
        seo: {
            metaTitle: {
                type: String,
                trim: true,
                maxlength: 70
            },
            metaDescription: {
                type: String,
                trim: true,
                maxlength: 170
            }
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/*
|--------------------------------------------------------------------------
| DATABASE INDEXES
|--------------------------------------------------------------------------
| Proper indexes dramatically improve filtering speed.
*/
/*
|--------------------------------------------------------------------------
| Seller Dashboard
|--------------------------------------------------------------------------
*/
propertySchema.index({
    seller: 1,
    createdAt: -1
});

/*
|--------------------------------------------------------------------------
| Property Search
|--------------------------------------------------------------------------
*/
propertySchema.index({
    propertyType: 1,
    listingType: 1,
    price: 1
});

/*
|--------------------------------------------------------------------------
| Location Search
|--------------------------------------------------------------------------
*/
propertySchema.index({
    "location.city": 1,
    "location.state": 1
});

/*
|--------------------------------------------------------------------------
| Approval Search
|--------------------------------------------------------------------------
*/
propertySchema.index({
    "approval.status": 1
});

/*
|--------------------------------------------------------------------------
| Listing Search
|--------------------------------------------------------------------------
*/
propertySchema.index({
    listingStatus: 1
});

propertySchema.index({
    slug: 1
});

propertySchema.index({
    title: "text",
    description: "text"
});

/*
|--------------------------------------------------------------------------
| PROPERTY MODEL
|--------------------------------------------------------------------------
*/

const Property = mongoose.model(
    "Property",
    propertySchema
);

export default Property;