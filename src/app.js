import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dashboardRoutes from "./routes/dashboard.routes.js";
import sellerProfileRoutes from "./routes/seller/seller-profile.routes.js";
import sellerPropertyRoutes from "./routes/seller/seller-property.routes.js";
import publicPropertyRoutes from "./routes/public-property.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminDashboardRoutes from "./routes/admin/admin-dashboard.routes.js";
import adminUserRoutes from "./routes/admin/user-management.routes.js";
import adminPropertyRoutes from "./routes/admin/property-management.routes.js";
import buyerDashboardRoutes from "./routes/buyer/buyer-dashboard.routes.js";
import propertyDiscoveryRoutes from "./routes/buyer/property-discovery.routes.js";
import favouriteRoutes from "./routes/buyer/favourite.routes.js";
import recentlyViewedRoutes from "./routes/buyer/recently-viewed.routes.js";
import buyerEnquiryRoutes from "./routes/buyer/buyer-enquiry.routes.js";
import property360RequestRoutes from "./routes/buyer/property-360-request.routes.js";
import buyerProfileRoutes from "./routes/buyer/buyer-profile.routes.js";
import brokerDashboardRoutes from "./routes/broker/broker-dashboard.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import multerErrorHandler from "./middleware/multer-error.middleware.js";

/*
 * ============================================================
 * EXPRESS APPLICATION
 * ============================================================
 */
const app = express();

/*
 * ============================================================
 * SECURITY HEADERS
 * ============================================================
 *
 * Helmet adds several security-related HTTP headers.
 * ============================================================
 */
app.use(helmet());

/*
 * ============================================================
 * CORS
 * ============================================================
 *
 * Only our configured frontend is allowed to access the API.
 *
 * credentials: true is necessary if your senior's
 * authentication uses cookies.
 * ============================================================
 */
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ]
    })
);

/*
 * ============================================================
 * GLOBAL RATE LIMIT
 * ============================================================
 *
 * This is a basic first layer.
 *
 * Individual sensitive APIs can later receive stricter
 * rate limits.
 * ============================================================
 */
const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Too many requests. Please try again later."
    }
});
app.use(globalRateLimiter);

/*
 * ============================================================
 * BODY PARSERS
 * ============================================================
 *
 * Keep JSON requests reasonably small.
 *
 * Image uploads use Multer separately.
 * ============================================================
 */
app.use(
    express.json({
        limit: "100kb"
    })
);
app.use(
    express.urlencoded({
        extended: false,
        limit: "100kb"
    })
);

/*
 * ============================================================
 * COOKIE PARSER
 * ============================================================
 *
 * Required if authentication uses HttpOnly cookies.
 * ============================================================
 */
app.use(cookieParser());

/*
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */
app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Real Estate API is running",
        environment: process.env.NODE_ENV
    });
});

/*
 * ============================================================
 * API ROUTES
 * ============================================================
 */
app.use(
    "/api/v1/seller/dashboard",
    dashboardRoutes
);
app.use(
    "/api/v1/seller/profile",
    sellerProfileRoutes
);
app.use(
    "/api/v1/seller/property",
    sellerPropertyRoutes
);
app.use(
    "/api/v1/properties",
    publicPropertyRoutes
);
app.use(
    "/api/v1/enquiries",
    enquiryRoutes
);
app.use(
    "/api/v1/contact",
    contactRoutes
);
app.use(
    "/api/v1/admin/dashboard",
    adminDashboardRoutes
);
app.use(
    "/api/v1/admin/users",
    adminUserRoutes
);
app.use(
    "/api/v1/admin/properties",
    adminPropertyRoutes
);
app.use(
    "/api/v1/buyer/dashboard",
    buyerDashboardRoutes
);
app.use(
    "/api/v1/buyer/properties",
    propertyDiscoveryRoutes
);
app.use(
    "/api/v1/buyer/favourites",
    favouriteRoutes
);
app.use(
    "/api/v1/buyer/recently-viewed",
    recentlyViewedRoutes
);
app.use(
    "/api/v1/buyer/enquiries",
    buyerEnquiryRoutes
);
app.use(
    "/api/v1/buyer/360-requests",
    property360RequestRoutes
);
app.use(
    "/api/v1/buyer/profile",
    buyerProfileRoutes
);
app.use(
    "/api/v1/broker/dashboard",
    brokerDashboardRoutes
);
/*
 * ============================================================
 * 404 HANDLER
 * ============================================================
 */
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

/*
 * ============================================================
 * GLOBAL ERROR HANDLER
 * ============================================================
 */
app.use(multerErrorHandler);
app.use(errorMiddleware);
export default app;