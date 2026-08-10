import Property360ViewService from "../services/property-360-view.service.js";
import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";

class Property360ViewController {

    /*
    |--------------------------------------------------------------------------
    | CREATE 360° VIEW
    |--------------------------------------------------------------------------
    */

    create360View = asyncHandler(async (req, res) => {

        const view = await Property360ViewService.create360View(
            req.user._id,
            req.params.propertyId,
            req.body.tourUrl
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                view,
                "360° view submitted successfully."
            )
        );
    });


    /*
    |--------------------------------------------------------------------------
    | GET SELLER 360° VIEW
    |--------------------------------------------------------------------------
    */

    getSeller360View = asyncHandler(async (req, res) => {

        const view = await Property360ViewService.getSeller360View(
            req.user._id,
            req.params.propertyId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                view,
                "360° view fetched successfully."
            )
        );
    });


    /*
    |--------------------------------------------------------------------------
    | DELETE 360° VIEW
    |--------------------------------------------------------------------------
    */

    delete360View = asyncHandler(async (req, res) => {

        await Property360ViewService.delete360View(
            req.user._id,
            req.params.propertyId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "360° view deleted successfully."
            )
        );
    });
}

export default new Property360ViewController();