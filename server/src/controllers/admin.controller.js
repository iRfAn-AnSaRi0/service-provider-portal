import { Application } from "../models/application.model.js";
import { asyncHandler } from "../utils/async.handler.js";
import { ApiResponse } from "../utils/api.response.js";
import { User } from "../models/user.model.js";

const getAllApplications = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    const status = req.query.status?.trim();

    let userIds = [];

if (search) {
    const users = await User.find({
        $or: [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: search,
                    $options: "i"
                }
            }
        ]
    }).select("_id");

    userIds = users.map((user) => user._id);
}

const allowedStatuses = [
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED"
];

if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(
        400,
        "Invalid application status"
    );
}

const filter = {};

if (search) {
    filter.userId = { $in: userIds };
}

if (status) {
    filter.status = status;
}



const applications = await Application.find(filter)
        .select(
            "userId phone serviceCategories location.city status createdAt"
        )
        .populate(
            "userId",
            "name email"
        )
        .sort({
            createdAt: -1
        })
        .skip(skip)
        .limit(limit);

    const totalApplications =
    await Application.countDocuments(filter);

    const totalPages =
        Math.ceil(totalApplications / limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                applications,
                pagination: {
                    page,
                    limit,
                    totalApplications,
                    totalPages
                }
            },
            "Applications fetched successfully"
        )
    );
});

const getApplicationById = asyncHandler(async (req, res) => {

    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
        .populate(
            "userId",
            "name email role"
        );

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            "Application details fetched successfully"
        )
    );
});

const reviewApplication = asyncHandler(async (req, res) => {

    const { applicationId } = req.params;

    const { status, rejectionRemarks } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    if (
        application.status !== "SUBMITTED" &&
        application.status !== "UNDER_REVIEW"
    ) {
        throw new ApiError(
            400,
            "Application cannot be reviewed at this stage"
        );
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
        throw new ApiError(
            400,
            "Status must be APPROVED or REJECTED"
        );
    }

    if (
        status === "REJECTED" &&
        !rejectionRemarks?.trim()
    ) {
        throw new ApiError(
            400,
            "Rejection remarks are required"
        );
    }

    application.status = status;

    application.reviewedAt = new Date();

    application.reviewedBy = req.user.id;

    if (status === "REJECTED") {
        application.rejectionRemarks =
            rejectionRemarks.trim();
    } else {
        application.rejectionRemarks = null;
    }

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            `Application ${status.toLowerCase()} successfully`
        )
    );
});

const getDashboardStats = asyncHandler(async (req, res) => {

    const totalApplications =
        await Application.countDocuments();

    const submitted =
        await Application.countDocuments({
            status: "SUBMITTED"
        });

    const underReview =
        await Application.countDocuments({
            status: "UNDER_REVIEW"
        });

    const approved =
        await Application.countDocuments({
            status: "APPROVED"
        });

    const rejected =
        await Application.countDocuments({
            status: "REJECTED"
        });

    const draft =
        await Application.countDocuments({
            status: "DRAFT"
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalApplications,
                submitted,
                underReview,
                approved,
                rejected,
                draft
            },
            "Dashboard statistics fetched successfully"
        )
    );
});

export { getAllApplications, getApplicationById, reviewApplication, getDashboardStats };