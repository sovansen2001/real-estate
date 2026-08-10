import Property360ManagementService
    from "../../services/admin/property-360-management.service.js";

import asyncHandler from "../../utils/async-handler.js";
import ApiResponse from "../../utils/api-response.js";

class Property360ManagementController {

    /*
    |--------------------------------------------------------------------------
    | GET ALL 360° VIEWS
    |--------------------------------------------------------------------------
    */

    getAll360Views = asyncHandler(async (req, res) => {

        const result =
            await Property360ManagementService.getAll360Views(
                req.query
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "360° views fetched successfully."
            )
        );
    });


    /*
    |--------------------------------------------------------------------------
    | APPROVE 360° VIEW
    |--------------------------------------------------------------------------
    */

    approve360View = asyncHandler(async (req, res) => {

        const view =
            await Property360ManagementService.approve360View(
                req.params.viewId,
                req.user._id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                view,
                "360° view approved successfully."
            )
        );
    });


    /*
    |--------------------------------------------------------------------------
    | REJECT 360° VIEW
    |--------------------------------------------------------------------------
    */

    reject360View = asyncHandler(async (req, res) => {

        const view =
            await Property360ManagementService.reject360View(
                req.params.viewId,
                req.user._id,
                req.body.reason
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                view,
                "360° view rejected successfully."
            )
        );
    });
}

export default new Property360ManagementController();