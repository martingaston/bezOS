import { Question } from "../../db/memoryDb";

export const activeQuestionBlock = (
  question: Question,
  endTime: string
): string => baseQuestionBlock(true, question, endTime);

export const expiredQuestionBlock = (
  question: Question,
  endTime: string
): string => baseQuestionBlock(false, question, endTime);

const baseQuestionBlock = (
  isActive: boolean,
  question: Question,
  endTime: string
): string => {
  const parsedOptions = question.options.reduce<Record<string, unknown>[]>(
    (parsed, option) => {
      if (isActive) {
        return parsed.concat([
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: option.text,
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: option.name,
              },
              action_id: `Question(${question.id}).Answer(${option.name})`,
            },
          },
        ]);
      } else {
        return parsed.concat([
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: option.text,
            },
          },
        ]);
      }
    },
    []
  );
  return JSON.stringify({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🤔 ${question.text}`,
        },
      },
      {
        type: "divider",
      },
      ...parsedOptions,
      {
        type: "divider",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: isActive
              ? `⏱️ This question is open until ${endTime}`
              : `⛔ This question closed at ${endTime}`,
          },
        ],
      },
    ],
  });
};
