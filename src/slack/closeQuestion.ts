import { WebClient } from "@slack/web-api";
import { ExpiredQuestion } from "../quiz/stopScheduledQuestions";
import { getEnv } from "../util/getEnv";
import { expiredQuestionBlock } from "./blocks/questionBlock";

export const closeQuestion = async (
  question: ExpiredQuestion
): Promise<boolean> => {
  const client = new WebClient(getEnv("SLACK_BOT_TOKEN"));

  const result = await client.chat.update({
    channel: question.slackChannel,
    blocks: expiredQuestionBlock(question),
    text: "bezOS is closing this question.",
    ts: question.slackTs,
  });

  return result.ok;
};
