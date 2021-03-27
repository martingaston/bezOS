import { App, Context, SlackAction } from "@slack/bolt";
import { QuizDatabase } from "../db/memoryDb";
import { answerQuestion } from "../quiz";
import { parseResponseMessage } from "../quiz/parsers";
import { Result, Answer } from "../types";
import { createQuestionBlock } from "./blocks/questionBlock";

export const getRoutes = (app: App, db: QuizDatabase): void => {
  app.message("hello", async ({ say }) => {
    const question = await db.getQuestion(
      "ab75bf4f-61a5-43c9-b1fd-486901654b2e"
    );
    let block;
    if (question.kind === "success") {
      block = createQuestionBlock(question.question, "2021-03-21T16:40:30Z");
    } else {
      block = "whoops - an error!";
    }

    // TODO: strengthen the types here
    say(JSON.parse(block));
  });

  const processAnswerUserInput = (
    body: SlackAction,
    context: Context
  ): Result<Answer, { message: string }> => {
    const questionId = context.actionIdMatches[1];
    const userId = body.user.id;
    const answer = context.actionIdMatches[2];

    if (typeof questionId !== "string" || typeof answer !== "string") {
      return { kind: "failure", message: "invalid user input provided" };
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
};