import { connect } from "mongoose";

export default async function connectToDb(uri: string) {
    try {
        await connect(uri);
        console.log("✅Connected to MongoDb");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
