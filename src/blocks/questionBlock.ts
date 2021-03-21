import { Question } from "../db/memoryDb";

export const createQuestionBlock = (
  question: Question,
  endTime: string
): string => {
  const parsedOptions = question.options.reduce<Record<string, unknown>[]>(
    (parsed, option) =>
      parsed.concat([
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
      ]),
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
            text: `⏱️ This question is open until ${endTime}`,
          },
        ],
      },
    ],
  });
};
