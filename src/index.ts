import express from "express";
import cookieParser from "cookie-parser";
import connectToDb from "./config/db.ts";
import config from "./config/config.ts";
import indexRouter from "./routes/index.route..ts";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routers
app.use("/api", indexRouter);

await connectToDb(config.mongoUri);
app.listen(config.port, () =>
    console.log(`Listening on port ${config.port}...`),
);
