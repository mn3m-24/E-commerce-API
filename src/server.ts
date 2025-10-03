import connectToDb from "./config/db.ts";
import config from "./config/config.ts";
import app from "./app.ts";

async function startServer() {
    await connectToDb(config.mongoUri);
    app.listen(config.port, () =>
        console.log(`Listening on port ${config.port}...`),
    );
}

startServer();
