/*
|--------------------------------------------------------------------------
| ADMIN ACCESS MIDDLEWARE
|--------------------------------------------------------------------------
|
| Gate for every /api/v1/admin/* route.
|
| Expects your senior's authentication middleware to run BEFORE this
| one and populate req.user (with at least _id and role, matching the
| User model's role enum: "Buyer" | "Seller" | "Broker" | "Admin").
|
| NOTE: seller.middleware.js in this codebase checks
| req.user.role !== "seller" (lowercase), but the User model's role
| enum is capitalized ("Seller", "Admin", ...). Whichever casing your
| senior's auth module actually issues in the token/session, make sure
| this check (and seller.middleware.js) matches it exactly, or every
| request will be wrongly rejected with 403.
|
|--------------------------------------------------------------------------
*/

export const requireAdmin = (req, res, next) => {

    if (!req.user) {

        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });

    }

    if (req.user.role !== "Admin") {

        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });

    }

    if (req.user.isActive === false) {

        return res.status(403).json({
            success: false,
            message: "This account has been deactivated."
        });

    }

    next();

};

export default requireAdmin;
