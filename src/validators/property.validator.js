import { z } from "zod";

/*
|--------------------------------------------------------------------------
| ENUMS
|--------------------------------------------------------------------------
| Keeping enums in one place makes validation
| easy to maintain.
|
*/
const PROPERTY_TYPES = [
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
];
const LISTING_TYPES = [
    "Sell",
    "Rent"
];
const AREA_UNITS = [
    "sqft",
    "sqm",
    "acre",
    "bigha",
    "katha",
    "decimal"
];
const FURNISHING_TYPES = [
    "Unfurnished",
    "Semi Furnished",
    "Fully Furnished"
];
const FACING_DIRECTIONS = [
    "North",
    "South",
    "East",
    "West",
    "North-East",
    "North-West",
    "South-East",
    "South-West"
];

/*
|--------------------------------------------------------------------------
| IMAGE VALIDATION
|--------------------------------------------------------------------------
*/
const imageSchema = z.object({
    url: z
        .string()
        .url("Invalid image url."),
    publicId: z
        .string()
        .trim()
        .min(1),
    isPrimary: z
        .boolean()
        .optional()
});

/*
|--------------------------------------------------------------------------
| AREA VALIDATION
|--------------------------------------------------------------------------
*/
const areaSchema = z.object({
    value: z
        .number()
        .positive("Area must be greater than zero."),
    unit: z
        .enum(AREA_UNITS)
});

/*
|--------------------------------------------------------------------------
| LOCATION VALIDATION
|--------------------------------------------------------------------------
*/
const locationSchema = z.object({
    address: z
        .string()
        .trim()
        .min(5)
        .max(250),
    locality: z
        .string()
        .trim()
        .min(2)
        .max(100),
    city: z
        .string()
        .trim()
        .min(2)
        .max(80),
    state: z
        .string()
        .trim()
        .min(2)
        .max(80),
    country: z
        .string()
        .trim()
        .default("India"),
    pincode: z
        .string()
        .regex(
            /^[1-9][0-9]{5}$/,
            "Invalid Indian pincode."
        ),
    geoLocation: z.object({
        type: z.literal("Point"),
        coordinates: z
            .array(z.number())
            .length(2)
    }).optional()
});

/*
|--------------------------------------------------------------------------
| SPECIFICATION VALIDATION
|--------------------------------------------------------------------------
*/
const specificationSchema = z.object({
    bedrooms: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    bathrooms: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    balconies: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    parking: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    furnishing: z
        .enum(FURNISHING_TYPES)
        .nullable()
        .optional(),
    propertyAge: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    floorNumber: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    totalFloors: z
        .number()
        .min(0)
        .nullable()
        .optional(),
    facing: z
        .enum(FACING_DIRECTIONS)
        .nullable()
        .optional()
});

/*
|--------------------------------------------------------------------------
| CREATE PROPERTY VALIDATION
|--------------------------------------------------------------------------
*/
export const createPropertySchema = z.object({
    title: z
        .string()
        .trim()
        .min(10, "Title should contain at least 10 characters.")
        .max(120),
    description: z
        .string()
        .trim()
        .min(50, "Description should contain at least 50 characters.")
        .max(5000),
    propertyType: z.enum(PROPERTY_TYPES),
    listingType: z.enum(LISTING_TYPES),
    price: z
        .number()
        .positive("Price should be greater than zero."),
    negotiable: z
        .boolean()
        .optional(),
    currency: z
        .string()
        .default("INR"),
    area: areaSchema,
    location: locationSchema,
    specifications: specificationSchema,
    amenities: z
        .array(z.string().trim())
        .default([]),
    images: z
        .array(imageSchema)
        .default([])
})
.superRefine((data, ctx) => {
    /*
    |--------------------------------------------------------------------------
    | LAND / PLOT VALIDATION
    |--------------------------------------------------------------------------
    */
    if (
        data.propertyType === "Plot" ||
        data.propertyType === "Commercial Land"
    ) {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Residential Properties
    |--------------------------------------------------------------------------
    */
    if (!data.specifications.bedrooms) {
        ctx.addIssue({
            code: "custom",
            path: ["specifications", "bedrooms"],
            message: "Bedrooms are required."
        });
    }
    if (!data.specifications.bathrooms) {
        ctx.addIssue({
            code: "custom",
            path: ["specifications", "bathrooms"],
            message: "Bathrooms are required."
        });
    }
});
export default createPropertySchema;