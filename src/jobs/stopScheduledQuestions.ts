import { QuizDatabase } from "../db/memory/memoryDb";
import { WebClient } from "@slack/web-api";
import { expiredQuestionBlock } from "../slack/blocks/questionBlock";

export const stopScheduledQuestions = async (
  time: Date,
  db: QuizDatabase,
  client: WebClient
): Promise<void> => {
  const stopped = await db.stopScheduledQuestions(time);
  stopped.forEach((scheduledQuestion) => {
    client.chat.update({
      channel: "C01PDG2U3FY",
      blocks: expiredQuestionBlock(
        scheduledQuestion.question,
        scheduledQuestion.scheduledId,
        Math.floor(scheduledQuestion.endTime.getTime() / 1000)
      ),
      text: "bezOS is closing this question.",
      ts: scheduledQuestion.slackTs,
    });
  });
};
