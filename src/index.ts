import "./config"; // imports are hoisted so this needs to come first
import { app } from "./slack/app";
import { getEnv } from "./util/getEnv";
import { getRoutes } from "./slack/routes";
import { memoryDb } from "./db/memory/memoryDb";
import { WebClient } from "@slack/web-api";
import schedule from "node-schedule";
import { stopScheduledQuestions } from "./jobs/stopScheduledQuestions";
import { notifyRespondents } from "./jobs/notifyRespondents";

const db = memoryDb();
const slackClient = new WebClient(getEnv("SLACK_BOT_TOKEN"));

getRoutes(app, db);

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  schedule.scheduleJob("* * * * *", async (time: Date) => {
    console.log(`Checking active questions at ${time.toISOString()}...`);
    await stopScheduledQuestions(time, db, slackClient);
  });

  schedule.scheduleJob("* * * * *", async (time: Date) => {
    console.log(
      `Checking whether users need notifying at ${time.toISOString()}...`
    );
    await notifyRespondents(db, slackClient);
  });

  console.log(`⚡️ Bolt app is running on port ${parseInt(getEnv("PORT"))}!`);
})();
