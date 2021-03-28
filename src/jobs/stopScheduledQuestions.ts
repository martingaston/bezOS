import { QuizDatabase } from "../db/memoryDb";
import { WebClient } from "@slack/web-api";
import { expiredQuestionBlock } from "../slack/blocks/questionBlock";

export const stopScheduledQuestions = async (
  time: Date,
  db: QuizDatabase,
  client: WebClient
): Promise<void> => {
  const stopped = await db.stopScheduledQuestions(time);
  console.log(stopped);
  stopped.forEach((scheduledQuestion) => {
    client.chat.update({
      channel: "C01PDG2U3FY",
      blocks: JSON.parse(
        expiredQuestionBlock(
          scheduledQuestion.question,
          scheduledQuestion.endTime.toISOString()
        )
      )["blocks"],
      text: "bye now",
      ts: scheduledQuestion.slackTs,
    });
  });
};
