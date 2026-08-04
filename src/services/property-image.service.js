import cloudinary from "../config/cloudinary.js";
import Property from "../models/property.model.js";
import ApiError from "../utils/api-error.js";

/*
|--------------------------------------------------------------------------
| Property Image Service
|--------------------------------------------------------------------------
|
| Handles all property image operations.
|
| Responsibilities
| ----------------
| • Upload property images
| • Validate ownership
| • Validate property status
| • Save Cloudinary image information
| • Rollback uploaded images on failure
|
|--------------------------------------------------------------------------
*/

class PropertyImageService {

    /*
    |--------------------------------------------------------------------------
    | Upload Property Images
    |--------------------------------------------------------------------------
    */

    async uploadImages(propertyId, sellerId, files) {

        /*
        -------------------------------------------------------------
        | Validate uploaded files
        -------------------------------------------------------------
        */

        if (!files || files.length === 0) {
            throw new ApiError(
                400,
                "Please upload at least one image."
            );
        }

        /*
        -------------------------------------------------------------
        | Find Property
        -------------------------------------------------------------
        */

        const property = await Property.findOne({
            _id: propertyId,
            seller: sellerId,
            isDeleted: false
        });

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        /*
        -------------------------------------------------------------
        | Allow upload only for Draft / Rejected
        -------------------------------------------------------------
        */

        if (
            !["Draft", "Rejected"].includes(
                property.approval.status
            )
        ) {
            throw new ApiError(
                403,
                "Images cannot be modified after submission."
            );
        }

        /*
        -------------------------------------------------------------
        | Maximum Image Validation
        -------------------------------------------------------------
        */

        const totalImages =
            property.images.length + files.length;

        if (totalImages > 15) {

            throw new ApiError(
                400,
                "Maximum 15 images are allowed."
            );

        }

        /*
        -------------------------------------------------------------
        | Upload Images To Cloudinary
        -------------------------------------------------------------
        */

        const uploadedImages = [];

        try {

            for (let index = 0; index < files.length; index++) {

                const file = files[index];

                const uploadResult =
                    await new Promise((resolve, reject) => {

                        cloudinary.uploader.upload_stream(

                            {
                                folder: "real-estate/properties",

                                resource_type: "image"

                            },

                            (error, result) => {

                                if (error) {
                                    return reject(error);
                                }

                                resolve(result);

                            }

                        ).end(file.buffer);

                    });

                uploadedImages.push({

                    url: uploadResult.secure_url,

                    publicId: uploadResult.public_id,

                    isPrimary:
                        property.images.length === 0 &&
                        index === 0,

                    displayOrder:
                        property.images.length +
                        index + 1

                });

            }

            /*
            ---------------------------------------------------------
            | Save Images In Database
            ---------------------------------------------------------
            */

            property.images.push(...uploadedImages);

            await property.save();

            return property.images;

        }

        catch (error) {

            /*
            ---------------------------------------------------------
            | Rollback Cloudinary Uploads
            ---------------------------------------------------------
            */

            for (const image of uploadedImages) {

                try {

                    await cloudinary.uploader.destroy(
                        image.publicId
                    );

                }

                catch (rollbackError) {

                    console.error(
                        "Rollback Failed:",
                        rollbackError.message
                    );

                }

            }

            throw error;

        }

    }
    /*
    |--------------------------------------------------------------------------
    | Delete Property Image
    |--------------------------------------------------------------------------
    */

    async deleteImage(propertyId, sellerId, imageId) {

        const property = await Property.findOne({
            _id: propertyId,
            seller: sellerId,
            isDeleted: false
        });

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        if (
            !["Draft", "Rejected"].includes(
                property.approval.status
            )
        ) {
            throw new ApiError(
                403,
                "Images cannot be modified after submission."
            );
        }

        const image = property.images.id(imageId);

        if (!image) {
            throw new ApiError(
                404,
                "Image not found."
            );
        }

        await cloudinary.uploader.destroy(
            image.publicId
        );

        image.deleteOne();

        /*
        ---------------------------------------------------------
        | Ensure At Least One Primary Image
        ---------------------------------------------------------
        */

        if (
            property.images.length > 0 &&
            !property.images.some(img => img.isPrimary)
        ) {
            property.images[0].isPrimary = true;
        }

        await property.save();

        return property.images;

    }

    /*
    |--------------------------------------------------------------------------
    | Set Primary Image
    |--------------------------------------------------------------------------
    */

    async setPrimaryImage(
        propertyId,
        sellerId,
        imageId
    ) {

        const property = await Property.findOne({
            _id: propertyId,
            seller: sellerId,
            isDeleted: false
        });

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        if (
            !["Draft", "Rejected"].includes(
                property.approval.status
            )
        ) {
            throw new ApiError(
                403,
                "Images cannot be modified."
            );
        }

        const image = property.images.id(imageId);

        if (!image) {
            throw new ApiError(
                404,
                "Image not found."
            );
        }

        property.images.forEach(img => {
            img.isPrimary = false;
        });

        image.isPrimary = true;

        await property.save();

        return property.images;

    }

    /*
    |--------------------------------------------------------------------------
    | Reorder Images
    |--------------------------------------------------------------------------
    |
    | imageOrders Example:
    |
    | [
    |   { imageId, displayOrder },
    |   { imageId, displayOrder }
    | ]
    |
    |--------------------------------------------------------------------------
    */

    async reorderImages(
        propertyId,
        sellerId,
        imageOrders
    ) {

        const property = await Property.findOne({
            _id: propertyId,
            seller: sellerId,
            isDeleted: false
        });

        if (!property) {
            throw new ApiError(
                404,
                "Property not found."
            );
        }

        if (
            !["Draft", "Rejected"].includes(
                property.approval.status
            )
        ) {
            throw new ApiError(
                403,
                "Images cannot be modified."
            );
        }

        imageOrders.forEach(order => {

            const image = property.images.id(
                order.imageId
            );

            if (image) {
                image.displayOrder =
                    order.displayOrder;
            }

        });
        property.images.sort(
            (a, b) =>
                a.displayOrder - b.displayOrder
        );
        await property.save();
        return property.images;
    }
}
export default new PropertyImageService();