import { Block, KnownBlock } from "@slack/bolt";
import { Question } from "../../quiz/types";

export const activeQuestionBlock = (
  question: Question
): (Block | KnownBlock)[] => baseQuestionBlock(true, question);

export const expiredQuestionBlock = (
  question: Question
): (Block | KnownBlock)[] => baseQuestionBlock(false, question);

const baseQuestionBlock = (
  isActive: boolean,
  question: Question
): (Block | KnownBlock)[] => {
  const parsedOptions = question.details.options.reduce<(Block | KnownBlock)[]>(
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
              // TODO: generating action_id should be own function
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
        text: `🤔 ${question.details.text}`,
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
            ? `⏱️ This question is open until <!date^${Math.floor(
                question.endDate.getTime() / 1000
              )}^{date_pretty} at {time}|${question.endDate}>`
            : `⛔ This question closed <!date^${Math.floor(
                question.endDate.getTime() / 1000
              )}^{date} at {time}|${question.endDate}>`,
        },
      ],
    },
  ];
};
