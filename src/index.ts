import "./config"; // imports are hoisted so this needs to come first
import { app } from "./app";
import { getEnv } from "./util/getEnv";
import { randomCelebrationEmoji } from "./util/randomCelebrationEmoji";
import { answerQuestion } from "./quiz";
import { Context, SlackAction } from "@slack/bolt";
import { memoryDb } from "./db/memoryDb";
import { createQuestionBlock } from "./blocks/questionBlock";

const db = memoryDb();

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ say }) => {
  const question = await db.getQuestion("ab75bf4f-61a5-43c9-b1fd-486901654b2e");
  let block;
  if (question.kind === "success") {
    block = createQuestionBlock(question.question, "2021-03-21T16:40:30Z");
  } else {
    block = "whoops - an error!";
  }

  // TODO: strengthen the types here
  say(JSON.parse(block));
});

type QuestionActionInputResult =
  | QuestionActionInputSuccess
  | QuestionActionInputFailure;

type QuestionActionInputSuccess = {
  kind: "success";
  questionId: string;
  userId: string;
  answer: string;
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
  const answer = context.actionIdMatches[2];

  if (typeof questionId !== "string" || typeof answer !== "string") {
    return { kind: "failure", userId, message: "invalid user input provided" };
  }

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

  console.log(`⚡️ Bolt app is running on port ${parseInt(getEnv("PORT"))}!`);
})();
