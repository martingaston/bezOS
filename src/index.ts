import "./config"; // imports are hoisted so this needs to come first
import { app } from "./slack/app";
import { getEnv } from "./util/getEnv";
import { getRoutes } from "./slack/routes";
import schedule from "node-schedule";
import { stopScheduledQuestionsJob } from "./jobs/stopScheduledQuestionsJob";
import { notifyQuestionRespondentsJob } from "./jobs/notifyQuestionRespondentsJob";

getRoutes(app);

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  schedule.scheduleJob("* * * * *", async (time: Date) => {
    console.log(`Checking active questions at ${time.toISOString()}...`);
    await stopScheduledQuestionsJob(time);
  });

  schedule.scheduleJob("* * * * *", async (time: Date) => {
    console.log(
      `Checking whether users need notifying at ${time.toISOString()}...`
    );
    await notifyQuestionRespondentsJob();
  });

  console.log(`⚡️ Bolt app is running on port ${parseInt(getEnv("PORT"))}!`);
})();
