import { Application } from "../models/application.model.js";
import { asyncHandler } from "../utils/async.handler.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadFile } from "../config/cloudinary.config.js";
import { validateApplication } from "../validators/application.validator.js";

const createApplication = asyncHandler(async (req, res) => {

    const {
        phone,
        dateOfBirth
    } = req.body;

    const serviceCategories =
        JSON.parse(req.body.serviceCategories);

    const skills =
        JSON.parse(req.body.skills);

    const experience =
        JSON.parse(req.body.experience);

    const location =
        JSON.parse(req.body.location);

    const { isValid, errors } = validateApplication({
        phone,
        dateOfBirth,
        serviceCategories,
        skills,
        experience,
        location
    });

    // console.log("VALIDATION ERRORS:", errors);

    if (!isValid) {
        throw new ApiError(
            400,
            "Application validation failed",
            errors
        );
    }


    const existingApplication = await Application.findOne({
        userId: req.user.id
    });

    if (existingApplication) {
        throw new ApiError(
            409,
            "Application already exists"
        );
    }


    const profilePhoto =
        req.files?.profilePhoto?.[0];

    const identityProof =
        req.files?.identityProof?.[0];

    const addressProof =
        req.files?.addressProof?.[0];

    if (!profilePhoto) {
        throw new ApiError(
            400,
            "Profile photo is required"
        );
    }

    if (!identityProof) {
        throw new ApiError(
            400,
            "Identity proof is required"
        );
    }

    if (!addressProof) {
        throw new ApiError(
            400,
            "Address proof is required"
        );
    }


    const uploadedProfilePhoto = await uploadFile(
        profilePhoto.buffer,
        "service-provider-portal/profile"
    );

    const uploadedIdentityProof = await uploadFile(
        identityProof.buffer,
        "service-provider-portal/documents"
    );

    const uploadedAddressProof = await uploadFile(
        addressProof.buffer,
        "service-provider-portal/documents"
    );


    if (
        !uploadedProfilePhoto ||
        !uploadedIdentityProof ||
        !uploadedAddressProof
    ) {
        throw new ApiError(
            500,
            "File upload failed"
        );
    }


    const application = await Application.create({
        userId: req.user.id,

        phone,
        dateOfBirth,

        profilePhoto: {
            url: uploadedProfilePhoto.secure_url,
            publicId: uploadedProfilePhoto.public_id
        },

        serviceCategories,
        skills,
        experience,
        location,

        documents: {
            identityProof: {
                url: uploadedIdentityProof.secure_url,
                publicId: uploadedIdentityProof.public_id
            },

            addressProof: {
                url: uploadedAddressProof.secure_url,
                publicId: uploadedAddressProof.public_id
            }
        }
    });


    return res.status(201).json(
        new ApiResponse(
            201,
            application,
            "Application created successfully"
        )
    );
});

const getApplication = asyncHandler(async (req, res) => {
    const application = await Application.findOne({
        userId: req.user.id
    });

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
            "Application fetched successfully"
        )
    );
});

const updateApplication = asyncHandler(async (req, res) => {
    const application = await Application.findOne({
        userId: req.user.id
    });

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    // Only DRAFT and REJECTED applications can be edited
    if (
        application.status !== "DRAFT" &&
        application.status !== "REJECTED"
    ) {
        throw new ApiError(
            403,
            "Application cannot be edited at this stage"
        );
    }

    const {
        phone,
        dateOfBirth
    } = req.body;

    // Parse JSON fields coming from multipart/form-data
    const serviceCategories =
        req.body.serviceCategories
            ? JSON.parse(req.body.serviceCategories)
            : application.serviceCategories;

    const skills =
        req.body.skills
            ? JSON.parse(req.body.skills)
            : application.skills;

    const experience =
        req.body.experience
            ? JSON.parse(req.body.experience)
            : application.experience;

    const location =
        req.body.location
            ? JSON.parse(req.body.location)
            : application.location;

    const updatedData = {
        phone: phone ?? application.phone,
        dateOfBirth: dateOfBirth ?? application.dateOfBirth,
        serviceCategories,
        skills,
        experience,
        location
    };

    // Validate updated data
    const { isValid, errors } =
        validateApplication(updatedData);

    if (!isValid) {
        throw new ApiError(
            400,
            "Application validation failed",
            errors
        );
    }

    /*
     * Handle new files only if provider uploaded them
     */

    const profilePhoto =
        req.files?.profilePhoto?.[0];

    const identityProof =
        req.files?.identityProof?.[0];

    const addressProof =
        req.files?.addressProof?.[0];

    // Upload new profile photo
    if (profilePhoto) {
        const uploadedProfilePhoto =
            await uploadFile(
                profilePhoto.buffer,
                "service-provider-portal/profile"
            );

        if (!uploadedProfilePhoto) {
            throw new ApiError(
                500,
                "Profile photo upload failed"
            );
        }

        updatedData.profilePhoto = {
            url: uploadedProfilePhoto.secure_url,
            publicId: uploadedProfilePhoto.public_id
        };
    }

    // Upload new identity proof
    if (identityProof) {
        const uploadedIdentityProof =
            await uploadFile(
                identityProof.buffer,
                "service-provider-portal/documents"
            );

        if (!uploadedIdentityProof) {
            throw new ApiError(
                500,
                "Identity proof upload failed"
            );
        }

        updatedData.documents = {
            ...application.documents,
            identityProof: {
                url: uploadedIdentityProof.secure_url,
                publicId: uploadedIdentityProof.public_id
            }
        };
    }

    // Upload new address proof
    if (addressProof) {
        const uploadedAddressProof =
            await uploadFile(
                addressProof.buffer,
                "service-provider-portal/documents"
            );

        if (!uploadedAddressProof) {
            throw new ApiError(
                500,
                "Address proof upload failed"
            );
        }

        updatedData.documents = {
            ...updatedData.documents,
            ...application.documents,
            addressProof: {
                url: uploadedAddressProof.secure_url,
                publicId: uploadedAddressProof.public_id
            }
        };
    }

    const updatedApplication =
        await Application.findByIdAndUpdate(
            application._id,
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedApplication,
            "Application updated successfully"
        )
    );
});

const submitApplication = asyncHandler(async (req, res) => {

    const application = await Application.findOne({
        userId: req.user.id
    });

    if (!application) {
        throw new ApiError(
            404,
            "Application not found"
        );
    }

    if (application.status !== "DRAFT") {
        throw new ApiError(
            400,
            "Application cannot be submitted at this stage"
        );
    }

    application.status = "SUBMITTED";
    application.submittedAt = new Date();

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            "Application submitted successfully"
        )
    );
});

export { createApplication, getApplication, updateApplication, submitApplication };