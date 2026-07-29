import { v2 as cloudinary } from "cloudinary";

/*
 * ============================================================
 * CLOUDINARY CONFIGURATION
 * ============================================================
 *
 * Property images will be stored in Cloudinary rather than
 * directly inside the Node.js server.
 *
 * MongoDB will store:
 *
 * - image URL
 * - Cloudinary public ID
 *
 * Secrets come from .env.
 * ============================================================
 */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;