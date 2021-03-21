import "./config"; // imports are hoisted so this needs to come first
import { app } from "./app";
import { getEnv } from "./util/getEnv";
import { randomCelebrationEmoji } from "./util/randomCelebrationEmoji";
import { answerQuestion } from "./quiz";
import { Context, SlackAction } from "@slack/bolt";
import { memoryDb } from "./db/memoryDb";

const db = memoryDb();

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  if (message.subtype === undefined) {
    await say(`Hey there <@${message.user}>!`);
  }
});

type QuestionActionInputResult =
  | QuestionActionInputSuccess
  | QuestionActionInputFailure;

type QuestionActionInputSuccess = {
  kind: "success";
  questionId: string;
  userId: string;
  answer: number;
};

type QuestionActionInputFailure = {
  kind: "failure";
  userId: string;
  message: string;
};

const processAnswerUserInput = (
  body: SlackAction,
  context: Context
): QuestionActionInputResult => {
  const questionId = context.actionIdMatches[1];
  const userId = body.user.id;
  const answer = parseInt(context.actionIdMatches[2]);

  return { kind: "success", questionId, userId, answer };
};

app.action(
  /^Question\((.*)\).Answer\((.*)\)$/,
  async ({ ack, body, context, client }) => {
    // Acknowledge action request
    await ack();

    const questionActionUserInput = processAnswerUserInput(body, context);

    const postEphemeral = async (message: string) =>
      await client.chat.postEphemeral({
        channel: body.channel?.id ?? "",
        user: questionActionUserInput.userId,
        text: message,
      });

    if (questionActionUserInput.kind === "failure") {
      await postEphemeral(
        `There was an error submitting your answer: ${questionActionUserInput.message}`
      );
      return;
    }

    const { questionId, userId, answer } = questionActionUserInput;

    const result = await answerQuestion(db, questionId, userId, answer);
    result.kind === "success"
      ? postEphemeral(
          `You answered option ${answer} to the question ${randomCelebrationEmoji()}`
        )
      : postEphemeral(`There was an error submitting your answer`);
  }
);

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log("⚡️ Bolt app is running!");
})();
