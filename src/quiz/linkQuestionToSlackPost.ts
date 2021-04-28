import { Question } from "./types";
import { db } from "../db";

type SlackNotification = {
  slackTs: string;
  slackChannel: string;
};

export const linkQuestionToSlackPost = async (
  question: Question,
  channel: string,
  slackTs: string
): Promise<Question & SlackNotification> => {
  try {
    const notification = await db.questions.addRoundQuestionSlackNotification(
      question.id,
      channel,
      slackTs
    );

    return {
      ...question,
      slackTs: notification.slackTs,
      slackChannel: notification.slackChannel,
    };
  } catch (e) {
    return Promise.reject(
      `There was an error linking the question to Slack: ${e}`
    );
  }
};
