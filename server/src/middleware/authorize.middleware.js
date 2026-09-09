import { ApiError } from "../utils/api.error.js";

const authorize = (...allowedRoles) => {

    return (req, _, next) => {

        if (!req.user) {
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403,
                "You do not have permission to access this resource"
            );
        }

        next();
    };
};

export { authorize };