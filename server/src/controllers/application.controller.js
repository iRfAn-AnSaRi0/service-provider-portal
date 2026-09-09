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

export { createApplication };