import { Router } from "express";

import FavouriteController
    from "../../controllers/buyer/favourite.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| BUYER FAVOURITES
|--------------------------------------------------------------------------
|
| Base:
| /api/v1/buyer/favourites
|
|--------------------------------------------------------------------------
*/

router.post(
    "/:propertyId",
    // verifyJWT,
    // requireBuyer,
    FavouriteController.addFavourite
);
router.get(
    "/",
    // verifyJWT,
    // requireBuyer,
    FavouriteController.getMyFavourites
);
router.delete(
    "/:propertyId",
    // verifyJWT,
    // requireBuyer,
    FavouriteController.removeFavourite
);
export default router;