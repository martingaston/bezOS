import { Block, KnownBlock } from "@slack/bolt";
import { Question } from "../../db/memoryDb";

export const activeQuestionBlock = (
  question: Question,
  endTime: number
): (Block | KnownBlock)[] => baseQuestionBlock(true, question, endTime);

export const expiredQuestionBlock = (
  question: Question,
  endTime: number
): (Block | KnownBlock)[] => baseQuestionBlock(false, question, endTime);

const baseQuestionBlock = (
  isActive: boolean,
  question: Question,
  endTime: number
): (Block | KnownBlock)[] => {
  const parsedOptions = question.options.reduce<(Block | KnownBlock)[]>(
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
  return [
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
            ? `⏱️ This question is open until <!date^${endTime}^{date_pretty} at {time}|${new Date(
                endTime
              ).toISOString()}>`
            : `⛔ This question closed <!date^${endTime}^{date} at {time}|${new Date(
                endTime
              ).toISOString()}>`,
        },
      ],
    },
  ];
};
