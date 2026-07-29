/*
 * ============================================================
 * ASYNC HANDLER
 * ============================================================
 *
 * Express will receive rejected promises and forward them to
 * the global error middleware.
 * ============================================================
 */

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch(next);
    };
};

export default asyncHandler;