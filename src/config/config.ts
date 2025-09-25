import "dotenv/config";

export default {
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/eComm",
    port: process.env.PORT || 3000,
    accessSecret: process.env.ACCESS_SECRET || "Access Secret",
    accessTTL: parseInt(process.env.ACCESS_TTL || "900"),
    refreshSecret: process.env.REFRESH_SECRET || "Refresh Secret",
    refreshTTL: parseInt(process.env.REFRESH_TTL || "604800"),
    get refreshOptions() {
        return {
            httpOnly: true,
            sameSite: "lax" as const,
            path: "/api/auth/refresh",
            maxAge: this.refreshTTL * 1000,
        };
    },
};
