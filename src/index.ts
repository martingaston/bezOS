import "./config"; // imports are hoisted so this needs to come first
import { app } from "./app";
import { getEnv } from "./util/getEnv";
import { answerQuestion } from "./quiz";
import { Context, SlackAction } from "@slack/bolt";

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

    if (questionActionUserInput.kind === "failure") {
      await client.chat.postEphemeral({
        channel: "",
        text: "",
        user: questionActionUserInput.userId,
      });

      return;
    }

    const { questionId, userId, answer } = questionActionUserInput;

    const result = answerQuestion(questionId, userId, answer);
    result.kind === "success"
      ? client.chat.postEphemeral({
          channel: "",
          text: "",
          user: userId,
        })
      : client.chat.postEphemeral({
          channel: "",
          text: "",
          user: userId,
        });
  }
);

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log("⚡️ Bolt app is running!");
})();
