/*
 * ============================================================
 * SELLER AUTHORIZATION MIDDLEWARE
 * ============================================================
 *
 * IMPORTANT:
 *
 * Your senior already has authentication.
 *
 * His authentication middleware must execute BEFORE this
 * middleware and attach the authenticated user to:
 *
 *     req.user
 *
 * Example:
 *
 *     req.user = {
 *         _id: "...",
 *         role: "seller"
 *     }
 *
 * We will connect this middleware to your senior's exact
 * authentication middleware after checking his project.
 * ============================================================
 */

export const requireSeller = (req, res, next) => {
    /*
     * If authentication did not populate req.user, the request
     * is not authenticated.
     */
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    /*
     * Seller-only APIs must not be accessible to buyers,
     * admins, or other roles.
     */
    if (req.user.role !== "seller") {
        return res.status(403).json({
            success: false,
            message: "Seller access required"
        });
    }

    next();
};