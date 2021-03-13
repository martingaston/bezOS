import "./config"; // imports are hoisted so this needs to come first
import { app } from "./app";
import { getEnv } from "./util/getEnv";

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log("⚡️ Bolt app is running!");
})();
