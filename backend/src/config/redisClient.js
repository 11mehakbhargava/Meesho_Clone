import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;

if (process.env.ENABLE_REDIS === "true") {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 3) {
          console.warn("⚠️ Redis reconnect limit reached. Disabling Redis.");
          return new Error("Redis reconnection stopped");
        }
        return 1000;
      },
    },
  });

  redisClient.on("connect", () => {
    console.log("🟢 Connected to Redis successfully!");
  });

  redisClient.on("error", (err) => {
    console.warn("⚠️ Redis warning:", err.message);
  });

  redisClient.connect().catch((error) => {
    console.warn("⚠️ Could not connect to Redis. Server will continue running without caching.");
  });
} else {
  console.log("ℹ️ Redis is disabled (ENABLE_REDIS=false). Skipping Redis connection.");
}

export default redisClient;