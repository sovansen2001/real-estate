import dotenv from "dotenv";

import app from "./app.js";
import connectDatabase from "./confiig/db.js";

/*
 * ============================================================
 * LOAD ENVIRONMENT VARIABLES
 * ============================================================
 */

dotenv.config();

/*
 * ============================================================
 * SERVER STARTUP
 * ============================================================
 */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        /*
         * Database connection must succeed before accepting
         * application traffic.
         */
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();