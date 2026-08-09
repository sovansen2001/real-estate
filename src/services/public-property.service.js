import mongoose from "mongoose";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| PUBLIC PROPERTY SERVICE
|--------------------------------------------------------------------------
| Business logic for publicly visible properties.
|
| Public properties must satisfy:
|
| - isDeleted = false
| - approval.status = Approved
| - listingStatus = Active
|
| No authentication is required.
|--------------------------------------------------------------------------
*/

class PublicPropertyService {

    /*
    |--------------------------------------------------------------------------
    | Build Public Property Filter
    |--------------------------------------------------------------------------
    */

    buildPublicFilter(filters = {}) {

        const query = {
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved"
        };

        /*
        |--------------------------------------------------------------------------
        | KEYWORD SEARCH
        |--------------------------------------------------------------------------
        */

        const keyword =
            typeof filters.keyword === "string"
                ? filters.keyword.trim()
                : "";

        if (keyword) {

            const escapedKeyword =
                keyword.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );

            query.$or = [
                {
                    title: {
                        $regex: escapedKeyword,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: escapedKeyword,
                        $options: "i"
                    }
                },
                {
                    "location.city": {
                        $regex: escapedKeyword,
                        $options: "i"
                    }
                },
                {
                    "location.locality": {
                        $regex: escapedKeyword,
                        $options: "i"
                    }
                }
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | LISTING TYPE
        |--------------------------------------------------------------------------
        |
        | Frontend:
        | sale / rent
        |
        | Database:
        | Sell / Rent
        |--------------------------------------------------------------------------
        */

        if (filters.listingType) {

            const listingType =
                String(filters.listingType)
                    .trim()
                    .toLowerCase();

            if (listingType === "sale") {
                query.listingType = "Sell";
            }

            if (listingType === "sell") {
                query.listingType = "Sell";
            }

            if (listingType === "rent") {
                query.listingType = "Rent";
            }
        }

        /*
        |--------------------------------------------------------------------------
        | PROPERTY TYPE
        |--------------------------------------------------------------------------
        */

        if (filters.propertyType) {

            const type =
                String(filters.propertyType)
                    .trim()
                    .toLowerCase();

            const propertyTypeMap = {
                apartment: "Apartment",
                flat: "Flat",
                villa: "Villa",
                house: "House",
                "independent-house": "House",
                plot: "Plot",
                land: "Plot",
                "farm-house": "Farm House",
                office: "Office",
                shop: "Shop",
                warehouse: "Warehouse",
                "commercial-land": "Commercial Land"
            };

            if (propertyTypeMap[type]) {

                query.propertyType =
                    propertyTypeMap[type];

            } else if (type === "commercial") {

                query.propertyType = {
                    $in: [
                        "Office",
                        "Shop",
                        "Warehouse",
                        "Commercial Land"
                    ]
                };
            }
        }

        /*
        |--------------------------------------------------------------------------
        | CITY
        |--------------------------------------------------------------------------
        */

        if (filters.city) {

            query["location.city"] = {
                $regex:
                    String(filters.city).trim(),
                $options: "i"
            };
        }

        /*
        |--------------------------------------------------------------------------
        | STATE
        |--------------------------------------------------------------------------
        */

        if (filters.state) {

            query["location.state"] = {
                $regex:
                    String(filters.state).trim(),
                $options: "i"
            };
        }

        /*
        |--------------------------------------------------------------------------
        | LOCALITY
        |--------------------------------------------------------------------------
        */

        if (filters.locality) {

            query["location.locality"] = {
                $regex:
                    String(filters.locality).trim(),
                $options: "i"
            };
        }

        /*
        |--------------------------------------------------------------------------
        | MIN PRICE
        |--------------------------------------------------------------------------
        */

        const minPrice =
            Number(filters.minPrice);

        const maxPrice =
            Number(filters.maxPrice);

        if (
            Number.isFinite(minPrice) ||
            Number.isFinite(maxPrice)
        ) {

            query.price = {};

            if (Number.isFinite(minPrice)) {
                query.price.$gte = minPrice;
            }

            if (Number.isFinite(maxPrice)) {
                query.price.$lte = maxPrice;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | BHK
        |--------------------------------------------------------------------------
        */

        const bedrooms =
            Number(filters.bedrooms);

        const minBedrooms =
            Number(filters.minBedrooms);

        if (Number.isFinite(bedrooms)) {

            query["specifications.bedrooms"] =
                bedrooms;

        } else if (Number.isFinite(minBedrooms)) {

            query["specifications.bedrooms"] = {
                $gte: minBedrooms
            };
        }

        /*
        |--------------------------------------------------------------------------
        | FURNISHING
        |--------------------------------------------------------------------------
        */

        if (filters.furnishing) {

            const furnishing =
                String(filters.furnishing)
                    .trim()
                    .toLowerCase();

            const furnishingMap = {
                fully: "Fully Furnished",
                "fully-furnished": "Fully Furnished",
                semi: "Semi Furnished",
                "semi-furnished": "Semi Furnished",
                unfurnished: "Unfurnished"
            };

            if (furnishingMap[furnishing]) {

                query["specifications.furnishing"] =
                    furnishingMap[furnishing];
            }
        }

        return query;
    }

    /*
    |--------------------------------------------------------------------------
    | GET FEATURED PROPERTIES
    |--------------------------------------------------------------------------
    */

    async getFeaturedProperties(limit = 8) {

        const safeLimit = Math.min(
            Math.max(Number(limit) || 8, 1),
            50
        );

        return await Property.find({
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved",
            isFeatured: true
        })
            .populate(
                "seller",
                "fullName phone whatsappNumber profileImage brokerProfile"
            )
            .sort({
                createdAt: -1
            })
            .limit(safeLimit)
            .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | GET LATEST PROPERTIES
    |--------------------------------------------------------------------------
    */

    async getLatestProperties(limit = 12) {

        const safeLimit = Math.min(
            Math.max(Number(limit) || 12, 1),
            50
        );

        return await Property.find({
            isDeleted: false,
            listingStatus: "Active",
            "approval.status": "Approved"
        })
            .populate(
                "seller",
                "fullName phone whatsappNumber profileImage brokerProfile"
            )
            .sort({
                createdAt: -1
            })
            .limit(safeLimit)
            .lean();
    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH PROPERTIES
    |--------------------------------------------------------------------------
    */

    async searchProperties(filters = {}) {

        const page =
            Math.max(
                Number(filters.page) || 1,
                1
            );

        const limit =
            Math.min(
                Math.max(
                    Number(filters.limit) || 12,
                    1
                ),
                50
            );

        const skip =
            (page - 1) * limit;

        const query =
            this.buildPublicFilter(filters);

        /*
        |--------------------------------------------------------------------------
        | SORT
        |--------------------------------------------------------------------------
        */

        let sort = {
            createdAt: -1
        };

        switch (
            String(filters.sort || "")
                .trim()
                .toLowerCase()
        ) {

            case "price-low":
            case "pricelow":
                sort = {
                    price: 1
                };
                break;

            case "price-high":
            case "pricehigh":
                sort = {
                    price: -1
                };
                break;

            case "oldest":
                sort = {
                    createdAt: 1
                };
                break;

            case "newest":
            case "newest-first":
                sort = {
                    createdAt: -1
                };
                break;

            default:
                sort = {
                    createdAt: -1
                };
        }

        /*
        |--------------------------------------------------------------------------
        | FETCH DATA + COUNT
        |--------------------------------------------------------------------------
        */

        const [
            properties,
            totalProperties
        ] = await Promise.all([

            Property.find(query)
                .populate(
                    "seller",
                    "fullName phone whatsappNumber profileImage brokerProfile"
                )
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),

            Property.countDocuments(query)

        ]);

        const totalPages =
            Math.ceil(
                totalProperties / limit
            );

        return {

            properties,

            pagination: {

                totalProperties,

                currentPage: page,

                totalPages,

                limit,

                hasNextPage:
                    page < totalPages,

                hasPreviousPage:
                    page > 1
            }
        };
    }

    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY DETAILS
    |--------------------------------------------------------------------------
    */

    async getPropertyDetails(propertyId) {

        if (
            !mongoose.Types.ObjectId.isValid(
                propertyId
            )
        ) {

            throw new ApiError(
                400,
                "Invalid property id."
            );
        }

        const property =
            await Property.findOne({

                _id: propertyId,

                isDeleted: false,

                listingStatus: "Active",

                "approval.status": "Approved"

            })
                .populate(
                    "seller",
                    "fullName phone whatsappNumber profileImage brokerProfile address"
                )
                .lean();

        if (!property) {

            throw new ApiError(
                404,
                "Property not found."
            );
        }

        /*
        |--------------------------------------------------------------------------
        | INCREMENT VIEW COUNT
        |--------------------------------------------------------------------------
        |
        | The property detail page is a public view.
        |--------------------------------------------------------------------------
        */

        await Property.updateOne(
            {
                _id: propertyId
            },
            {
                $inc: {
                    "analytics.views": 1
                }
            }
        );

        return property;
    }
}

export default new PublicPropertyService();