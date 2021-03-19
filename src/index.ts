import "./config"; // imports are hoisted so this needs to come first
import { app } from "./app";
import { getEnv } from "./util/getEnv";

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  if (message.subtype === undefined) {
    await say(`Hey there <@${message.user}>!`);
  }
});

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log("⚡️ Bolt app is running!");
})();
