import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { User } from "../models/user.model.js";

const authenticate = asyncHandler(async (req, res, next) => {

    const authHeader = req.header("Authorization");

    const token =
        req.cookies?.accessToken ||
        (authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null);

    if (!token) {
        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            throw new ApiError(
                401,
                "Access token expired"
            );
        }

        throw new ApiError(
            401,
            "Invalid access token"
        );
    }

    const user = await User.findById(decodedToken.id)
        .select("_id role");

    if (!user) {
        throw new ApiError(
            401,
            "User not found"
        );
    }

    req.user = {
        id: user._id.toString(),
        role: user.role,
    };

    next();
});

export { authenticate };