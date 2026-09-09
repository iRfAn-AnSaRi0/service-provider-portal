import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
    createApplication
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

export { applicationRouter };