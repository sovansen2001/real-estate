import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
            index: true
        },

        viewedAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/*
|--------------------------------------------------------------------------
| ONE HISTORY RECORD PER BUYER + PROPERTY
|--------------------------------------------------------------------------
*/

recentlyViewedSchema.index(
    {
        buyer: 1,
        property: 1
    },
    {
        unique: true
    }
);

/*
|--------------------------------------------------------------------------
| RECENTLY VIEWED QUERY
|--------------------------------------------------------------------------
*/

recentlyViewedSchema.index({
    buyer: 1,
    viewedAt: -1
});

const RecentlyViewed = mongoose.model(
    "RecentlyViewed",
    recentlyViewedSchema
);

export default RecentlyViewed;