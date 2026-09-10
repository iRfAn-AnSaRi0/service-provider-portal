import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import { authRouter } from './routes/auth.routes.js';
import { applicationRouter } from './routes/application.route.js';
import { adminRouter } from "./routes/admin.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ limit: '24kb', extended: true }));
app.use(cookieparser());

app.use("/api/auth", authRouter);
app.use("/api/provider", applicationRouter);
app.use("/api/admin", adminRouter);


export { app }