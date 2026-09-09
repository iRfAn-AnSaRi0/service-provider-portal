import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
    {

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },


        phone: {
            type: String,
            required: true,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        profilePhoto: {
            url: {
                type: String,
                default: null
            },
            publicId: {
                type: String,
                default: null
            }
        },

        serviceCategories: [
            {
                type: String,
                required: true,
                enum: [
                    "AC & Appliance Repair",
                    "Electrician",
                    "Plumber",
                    "Carpenter",
                    "Cleaning",
                    "Pest Control",
                    "Painting",
                    "Waterproofing",
                    "Beauty & Salon",
                    "Home Installation",
                ],
            },
        ],


        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        experience: {
            years: {
                type: Number,
                required: true,
                min: 0,
            },

            description: {
                type: String,
                trim: true,
                maxlength: 500,
            },
        },


        location: {
            address: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            pincode: {
                type: String,
                required: true,
                trim: true,
            },
        },

        documents: {
            identityProof: {
                url: {
                    type: String,
                    default: null
                },
                publicId: {
                    type: String,
                    default: null
                }
            },

            addressProof: {
                url: {
                    type: String,
                    default: null
                },
                publicId: {
                    type: String,
                    default: null
                }
            }
        },


        profileCompleted: {
            type: Boolean,
            default: false,
        },


        status: {
            type: String,
            enum: [
                "DRAFT",
                "SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
            ],
            default: "DRAFT",
        },


        rejectionRemarks: {
            type: String,
            default: null,
            trim: true,
            maxlength: 500,
        },

        submittedAt: {
            type: Date,
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },

        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const Application = mongoose.model(
    "Application",
    applicationSchema
);