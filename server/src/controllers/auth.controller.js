import { asyncHandler } from '../utils/async.handler.js';
import { ApiError } from '../utils/api.error.js';
import { ApiResponse } from '../utils/api.response.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const generateAccessAndRefreshToken = (user) => {

    const payload = {
        id: user._id.toString(),
        role: user.role,
    };

    const refreshToken = jwt.sign(

        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE || "7d",
            issuer: "service-provider-portal"
        }
    )
    const accessToken = jwt.sign(

        payload,
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE || "15m",
            issuer: "service-provider-portal"
        }
    )

    return { refreshToken, accessToken }

}

const register = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    const { isValid, errors } = validateRegister(req.body);

    if (!isValid) {
        throw new ApiError(
            400,
            "Validation failed",
            errors
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "Email already registered"
        );
    }


    await User.create({
        name,
        email: normalizedEmail,
        password
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Registration successful"
        )
    );
});

const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const { isValid, errors } = validateLogin(req.body);

    if (!isValid) {
        throw new ApiError(
            400,
            "Validation failed",
            errors
        )
    }

    const user = await User.findOne({
        email: email.toLowerCase().trim()
    })

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        )
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new ApiError(
            401,
            "Invalid email or password"
        )
    }

    const { refreshToken, accessToken } = generateAccessAndRefreshToken(user);

    const isProduction = process.env.NODE_ENV === "production";
    const option = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                "Login successfully"
            )
        )


})


const logout = asyncHandler(async (req, res) => {

    const isProduction = process.env.NODE_ENV === "production";

    const option = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.clearCookie("accessToken", option);
    res.clearCookie("refreshToken", option);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Logout successful"
        )
    );
});


const getMe = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)
        .select("-password");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User details fetched successfully"
        )
    );
});

const refreshToken = asyncHandler(async (req, res) => {

    const token = req.cookies.refreshToken;

    if (!token) {
        throw new ApiError(
            401,
            "Refresh token is required"
        );
    }

    let decoded;

    try {

        decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

    } catch (error) {

        throw new ApiError(
            401,
            "Invalid or expired refresh token"
        );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(
            401,
            "User not found"
        );
    }

    const {
        refreshToken: newRefreshToken,
        accessToken
    } = generateAccessAndRefreshToken(user);

    const isProduction =
        process.env.NODE_ENV === "production";

    const option = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    return res.status(200)
        .cookie(
            "accessToken",
            accessToken,
            option
        )
        .cookie(
            "refreshToken",
            newRefreshToken,
            option
        )
        .json(
            new ApiResponse(
                200,
                {},
                "Access token refreshed successfully"
            )
        );
});


export { register, login, logout, getMe, refreshToken }


