import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.route.ts";

const app: express.Express = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routers
app.use("/api", indexRouter);

export default app;
