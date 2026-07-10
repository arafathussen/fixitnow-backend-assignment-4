import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    jwt_secret: process.env.JWT_SECRET || "default_secret",
    jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
    jwt: {
        secret: process.env.JWT_SECRET || "default_secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    stripe_secret_key: process.env.STRIPE_SECRET_KEY || "",
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || "",
    app_url: process.env.APP_URL || "http://localhost:3000"
};
