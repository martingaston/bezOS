import { WebClient } from "@slack/web-api";
import { QuestionRespondentNotification } from "../quiz/getRespondentsThatNeedNotifying";
import { getEnv } from "../util/getEnv";

export const notifyRespondent = async (
  notification: QuestionRespondentNotification
): Promise<boolean> => {
  const client = new WebClient(getEnv("SLACK_BOT_TOKEN"));

  const text = processAnswer(notification);
  const result = await client.chat.postMessage({
    channel: notification.respondent.slackId,
    text,
  });

  return result.ok;
};

const processAnswer = (notification: QuestionRespondentNotification) => {
  if (notification.correct) {
    return "You got the question right 🎉";
  } else {
    return "You got the question wrong 😔";
  }
};
