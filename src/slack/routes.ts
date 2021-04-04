import { App, Context, SlackAction } from "@slack/bolt";
import { QuizDatabase } from "../db/memory/oldMemoryDb";
import { answerQuestion } from "../quiz";
import { parseResponseMessage } from "../quiz/parsers";
import { Result, Answer, SlackChatPostMessageResult } from "../types";
import { activeQuestionBlock } from "./blocks/questionBlock";
import { v4 as uuidv4 } from "uuid";

export const getRoutes = (app: App, db: QuizDatabase): void => {
  app.message("hello", async ({ say }) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 60 * 1000);
    const questionId = "ab75bf4f-61a5-43c9-b1fd-486901654b2e";
    const scheduledId = uuidv4();

    const question = await db.getQuestion(questionId);
    let block;
    if (question.kind === "success") {
      block = activeQuestionBlock(
        question.question,
        scheduledId,
        Math.floor(endTime.getTime() / 1000)
      );
    }

    const { ts: slackTs } = (await say({
      blocks: block,
      text: "A new question from bezOS!",
    })) as SlackChatPostMessageResult;

    db.scheduleQuestion(scheduledId, questionId, slackTs, startTime, endTime);
  });

  const processAnswerUserInput = (
    body: SlackAction,
    context: Context
  ): Result<Answer, { message: string }> => {
    const questionId = context.actionIdMatches[1];
    const scheduledId = context.actionIdMatches[2];
    const userId = body.user.id;
    const answer = context.actionIdMatches[3];

    if (
      typeof scheduledId !== "string" ||
      typeof questionId !== "string" ||
      typeof answer !== "string"
    ) {
      return { kind: "failure", message: "invalid user input provided" };
    }

    return { kind: "success", scheduledId, questionId, userId, answer };
  };

  app.action(
    /^Question\((.*)\).Scheduled\((.*)\).Answer\((.*)\)$/,
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
