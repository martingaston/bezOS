import "./config"; // imports are hoisted so this needs to come first
import { app } from "./slack/app";
import { getEnv } from "./util/getEnv";
import { getRoutes } from "./slack/routes";
import { memoryDb } from "./db/memoryDb";

const db = memoryDb();

getRoutes(app, db);

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log(`⚡️ Bolt app is running on port ${parseInt(getEnv("PORT"))}!`);
})();
