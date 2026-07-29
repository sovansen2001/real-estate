
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