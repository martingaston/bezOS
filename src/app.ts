import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { getEnv } from "./util/getEnv";

dotenv.config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log("⚡️ Bolt app is running!");
})();
