import Property from "../../models/property.model.js";
import ApiError from "../../utils/api-error.js";

class PropertyDiscoveryService {
    async getProperties(query = {}) {
        const page = Math.max(
            Number(query.page) || 1,
            1
        );
        const limit = Math.min(
            Math.max(Number(query.limit) || 12, 1),
            50
        );
        const skip = (page - 1) * limit;

        /*
        |--------------------------------------------------------------------------
        | ONLY PUBLICLY AVAILABLE PROPERTIES
        |--------------------------------------------------------------------------
        */
        const filter = {
            isDeleted: false,
            "approval.status": "Approved",
            listingStatus: "Active"
        };

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */
        if (query.search?.trim()) {
            const search = query.search.trim();
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    "location.city": {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    "location.locality": {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | CITY
        |--------------------------------------------------------------------------
        */
        if (query.city?.trim()) {
            filter["location.city"] = {
                $regex: query.city.trim(),
                $options: "i"
            };
        }

        /*
        |--------------------------------------------------------------------------
        | PROPERTY TYPE
        |--------------------------------------------------------------------------
        */
        if (query.propertyType?.trim()) {
            filter.propertyType = query.propertyType.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | LISTING TYPE
        |--------------------------------------------------------------------------
        */
        if (query.listingType?.trim()) {
            filter.listingType = query.listingType.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | PRICE RANGE
        |--------------------------------------------------------------------------
        */
        if (
            query.minPrice !== undefined ||
            query.maxPrice !== undefined
        ) {
            filter.price = {};
            if (query.minPrice !== undefined) {
                const minPrice = Number(query.minPrice);
                if (
                    !Number.isFinite(minPrice) ||
                    minPrice < 0
                ) {
                    throw new ApiError(
                        400,
                        "Invalid minimum price."
                    );
                }
                filter.price.$gte = minPrice;
            }

            if (query.maxPrice !== undefined) {
                const maxPrice = Number(query.maxPrice);
                if (
                    !Number.isFinite(maxPrice) ||
                    maxPrice < 0
                ) {
                    throw new ApiError(
                        400,
                        "Invalid maximum price."
                    );
                }
                filter.price.$lte = maxPrice;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | BEDROOMS
        |--------------------------------------------------------------------------
        */
        if (query.bedrooms !== undefined) {
            const bedrooms = Number(query.bedrooms);
            if (
                !Number.isInteger(bedrooms) ||
                bedrooms < 0
            ) {
                throw new ApiError(
                    400,
                    "Invalid bedrooms value."
                );
            }
            filter["specifications.bedrooms"] = bedrooms;
        }

        /*
        |--------------------------------------------------------------------------
        | FURNISHING
        |--------------------------------------------------------------------------
        */
        if (query.furnishing?.trim()) {
            filter["specifications.furnishing"] =
                query.furnishing.trim();
        }

        /*
        |--------------------------------------------------------------------------
        | AREA RANGE
        |--------------------------------------------------------------------------
        */
        if (
            query.minArea !== undefined ||
            query.maxArea !== undefined
        ) {
            filter["area.value"] = {};
            if (query.minArea !== undefined) {
                const minArea = Number(query.minArea);
                if (
                    !Number.isFinite(minArea) ||
                    minArea < 0
                ) {
                    throw new ApiError(
                        400,
                        "Invalid minimum area."
                    );
                }
                filter["area.value"].$gte = minArea;
            }

            if (query.maxArea !== undefined) {
                const maxArea = Number(query.maxArea);
                if (
                    !Number.isFinite(maxArea) ||
                    maxArea < 0
                ) {
                    throw new ApiError(
                        400,
                        "Invalid maximum area."
                    );
                }
                filter["area.value"].$lte = maxArea;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | AMENITIES
        |--------------------------------------------------------------------------
        */
        if (query.amenities) {
            const amenities = Array.isArray(query.amenities)
                ? query.amenities
                : query.amenities
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean);
            if (amenities.length > 0) {
                filter["amenities.amenities"] = {
                    $all: amenities
                };
            }
        }

        /*
        |--------------------------------------------------------------------------
        | SORTING
        |--------------------------------------------------------------------------
        */
        let sort = {
            createdAt: -1
        };
        switch (query.sort) {
            case "priceLow":
                sort = {
                    price: 1
                };
                break;
            case "priceHigh":
                sort = {
                    price: -1
                };
                break;
            case "oldest":
                sort = {
                    createdAt: 1
                };
                break;
            case "popular":
                sort = {
                    "analytics.views": -1
                };
                break;
            case "featured":
                sort = {
                    isFeatured: -1,
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
        | FETCH
        |--------------------------------------------------------------------------
        */
        const [
            properties,
            totalProperties
        ] = await Promise.all([
            Property.find(filter)
                .select([
                    "title",
                    "slug",
                    "description",
                    "propertyType",
                    "listingType",
                    "price",
                    "negotiable",
                    "currency",
                    "area",
                    "location",
                    "specifications",
                    "amenities",
                    "images",
                    "isFeatured",
                    "analytics.views"
                ].join(" "))
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Property.countDocuments(filter)
        ]);
        const totalPages =
            Math.ceil(totalProperties / limit);
        return {
            properties,
            pagination: {
                totalProperties,
                currentPage: page,
                totalPages,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }
}
export default new PropertyDiscoveryService();