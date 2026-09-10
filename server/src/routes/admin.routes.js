import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

import {
    getAllApplications, getApplicationById, reviewApplication,getDashboardStats
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorize("admin"));

adminRouter.get(
    "/dashboard/stats",
    getDashboardStats
);

adminRouter.get(
    "/applications",
    getAllApplications
);
adminRouter.get(
    "/applications/:applicationId",
    getApplicationById
);

adminRouter.put(
    "/applications/:applicationId/review",
    reviewApplication
);

export { adminRouter };