import PropertyManagementService from "../../services/admin/property-management.service.js";
import ApiResponse from "../../utils/api-response.js";

/*
|--------------------------------------------------------------------------
| ADMIN PROPERTY MANAGEMENT CONTROLLER
|--------------------------------------------------------------------------
|
| Handles admin requests for managing every property on the platform.
|
|--------------------------------------------------------------------------
*/

class PropertyManagementController {

    /*
    |--------------------------------------------------------------------------
    | GET ALL PROPERTIES
    |--------------------------------------------------------------------------
    */

    async getAllProperties(req, res, next) {

        try {

            const result = await PropertyManagementService.getAllProperties(req.query);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    result,
                    "Properties fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET PROPERTY STATISTICS
    |--------------------------------------------------------------------------
    */

    async getPropertyStatistics(req, res, next) {

        try {

            const stats = await PropertyManagementService.getPropertyStatistics();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    stats,
                    "Property statistics fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | GET SINGLE PROPERTY
    |--------------------------------------------------------------------------
    */

    async getPropertyById(req, res, next) {

        try {

            const { propertyId } = req.params;

            const property = await PropertyManagementService.getPropertyForAdmin(propertyId);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    property,
                    "Property fetched successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | APPROVE PROPERTY
    |--------------------------------------------------------------------------
    */

    async approveProperty(req, res, next) {

        try {

            const { propertyId } = req.params;

            const adminId = req.user?._id ?? null;

            const property = await PropertyManagementService.approveProperty(
                propertyId,
                adminId
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    property,
                    "Property approved successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | REJECT PROPERTY
    |--------------------------------------------------------------------------
    */

    async rejectProperty(req, res, next) {

        try {

            const { propertyId } = req.params;
            const { reason } = req.body;

            const adminId = req.user?._id ?? null;

            const property = await PropertyManagementService.rejectProperty(
                propertyId,
                adminId,
                reason
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    property,
                    "Property rejected successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | TOGGLE FEATURED
    |--------------------------------------------------------------------------
    */

    async setFeatured(req, res, next) {

        try {

            const { propertyId } = req.params;
            const { isFeatured } = req.body;

            const property = await PropertyManagementService.setFeatured(
                propertyId,
                Boolean(isFeatured)
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    property,
                    `Property ${isFeatured ? "featured" : "unfeatured"} successfully.`
                )
            );

        } catch (error) {

            next(error);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | DELETE PROPERTY
    |--------------------------------------------------------------------------
    */

    async deleteProperty(req, res, next) {

        try {

            const { propertyId } = req.params;

            await PropertyManagementService.deleteProperty(propertyId);

            return res.status(200).json(
                new ApiResponse(
                    200,
                    null,
                    "Property deleted successfully."
                )
            );

        } catch (error) {

            next(error);

        }

    }

}

export default new PropertyManagementController();
