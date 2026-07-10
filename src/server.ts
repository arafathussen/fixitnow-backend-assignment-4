import { Server } from "http";
import app from "./app";
import config from "./config";

let server: Server;

async function main() {
    try {
        server = app.listen(config.port, () => {
            console.log(`🚀 FixItNow server is listening on port ${config.port}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
}

main();

process.on("unhandledRejection", (err) => {
    console.log(`😈 unhandledRejection is detected, shutting down...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on("uncaughtException", () => {
    console.log(`😈 uncaughtException is detected, shutting down...`);
    process.exit(1);
});
