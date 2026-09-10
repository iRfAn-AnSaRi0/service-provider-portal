import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    createApplication, getApplication, updateApplication, submitApplication
} from "../controllers/application.controller.js";

const applicationRouter = Router();

applicationRouter.use(authenticate);
applicationRouter.use(authorize("provider"));

applicationRouter.post(
    "/application",
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
        {
            name: "identityProof",
            maxCount: 1
        },
        {
            name: "addressProof",
            maxCount: 1
        }
    ]),
    createApplication
);

applicationRouter.get(
    "/application",
    getApplication
)

applicationRouter.put(
    "/application",
    upload.fields([
        {
            name: "profilePhoto",
            maxCount: 1
        },
        {
            name: "identityProof",
            maxCount: 1
        },
        {
            name: "addressProof",
            maxCount: 1
        }
    ]),
    updateApplication
);

applicationRouter.post(
    "/application/submit",
    submitApplication
);

export { applicationRouter };