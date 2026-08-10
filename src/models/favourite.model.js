import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/*
|--------------------------------------------------------------------------
| ONE FAVOURITE PER BUYER + PROPERTY
|--------------------------------------------------------------------------
*/

favouriteSchema.index(
    {
        buyer: 1,
        property: 1
    },
    {
        unique: true
    }
);

const Favourite = mongoose.model(
    "Favourite",
    favouriteSchema
);

export default Favourite;