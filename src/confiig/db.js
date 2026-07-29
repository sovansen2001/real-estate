import mongoose from "mongoose";

/*
 * ============================================================
 * MONGODB DATABASE CONNECTION
 * ============================================================
 *
 * This file is responsible only for connecting the application
 * to MongoDB.
 *
 * Database credentials are NEVER hard-coded.
 * They come from environment variables.
 * ============================================================
 */

const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        /*
         * If the database is unavailable during startup,
         * the application should not continue running.
         */
        process.exit(1);
    }
};

export default connectDatabase;