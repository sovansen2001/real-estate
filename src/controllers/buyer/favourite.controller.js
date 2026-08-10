import FavouriteService
    from "../../services/buyer/favourite.service.js";

import ApiResponse
    from "../../utils/api-response.js";

class FavouriteController {

    async addFavourite(req, res, next) {

        try {

            const buyerId = req.user._id;
            const { propertyId } = req.params;

            const favourite =
                await FavouriteService.addFavourite(
                    buyerId,
                    propertyId
                );

            return res.status(201).json(
                new ApiResponse(
                    201,
                    favourite,
                    "Property added to favourites successfully."
                )
            );

        } catch (error) {

            next(error);

        }
    }
    async getMyFavourites(req, res, next) {

    try {

        const buyerId = req.user._id;

        const favourites =
            await FavouriteService.getMyFavourites(
                buyerId
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                favourites,
                "Favourites fetched successfully."
            )
        );

    } catch (error) {

        next(error);

    }
}
}

export default new FavouriteController();