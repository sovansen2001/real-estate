import multer from "multer";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| Multer Memory Storage
|--------------------------------------------------------------------------
|
| Images are stored in memory temporarily.
| They will be uploaded directly to Cloudinary.
|
|--------------------------------------------------------------------------
*/

const storage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| Allowed Image Types
|--------------------------------------------------------------------------
*/

const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
];

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
|
| Accept only valid image formats.
|
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {

    if (!allowedMimeTypes.includes(file.mimetype)) {

        return cb(
            new ApiError(
                400,
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            ),
            false
        );

    }

    cb(null, true);

};

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
*/
const upload = multer({
    storage,
    fileFilter,
    limits: {
        // 5 MB
        fileSize: 5 * 1024 * 1024,
        // Maximum 15 images
        files: 15
    }

});
export default upload;