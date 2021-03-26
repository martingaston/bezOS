import "./config"; // imports are hoisted so this needs to come first
import { app } from "./slack/app";
import { getEnv } from "./util/getEnv";
import { answerQuestion } from "./quiz";
import { Context, SlackAction } from "@slack/bolt";
import { memoryDb } from "./db/memoryDb";
import { createQuestionBlock } from "./slack/blocks/questionBlock";
import { Result } from "./types";
import { parseResponseMessage } from "./quiz/parsers";

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

type QuestionActionInputSuccess = {
  questionId: string;
  userId: string;
  answer: string;
};

type QuestionActionInputFailure = {
  userId: string;
  message: string;
};

const processAnswerUserInput = (
  body: SlackAction,
  context: Context
): Result<QuestionActionInputSuccess, QuestionActionInputFailure> => {
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
    await ack();

    const answer = processAnswerUserInput(body, context);
    if (answer.kind === "failure") {
      return;
    }

    const result = await answerQuestion(db, answer);

    await client.chat.postEphemeral({
      channel: body.channel?.id ?? "",
      text: parseResponseMessage(result),
      user: answer.userId,
    });
  }
);

(async () => {
  // Start your app
  await app.start(parseInt(getEnv("PORT")));

  console.log(`⚡️ Bolt app is running on port ${parseInt(getEnv("PORT"))}!`);
})();
