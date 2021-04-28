import { App, Context, SlackAction } from "@slack/bolt";
import { answerQuestion } from "../quiz/answerQuestion";
import { parseResponseMessage } from "../quiz/parsers";
import { Result, UserSubmittedAnswer } from "../types";
import { activeQuestionBlock } from "./blocks/questionBlock";
import { poseQuestion } from "../quiz/poseQuestion";
import { Question } from "../quiz/types";
import { Block, KnownBlock, WebAPICallResult, WebClient } from "@slack/web-api";
import { linkQuestionToSlackPost } from "../quiz/linkQuestionToSlackPost";

interface ChatPostMessageResult extends WebAPICallResult {
  channel: string;
  ts: string;
}

const generateStartAndEndTimes = () => {
  return {
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 1000),
  };
};

const postQuestionToChannel = async (
  client: WebClient,
  question: Question,
  channel: string
) => {
  const block = activeQuestionBlock(question);
  const { ts } = await postBlockToSlackChannel(client, block, channel);

  return ts;
};

const postBlockToSlackChannel = async (
  client: WebClient,
  block: (Block | KnownBlock)[],
  channel: string
) => {
  return (await client.chat.postMessage({
    channel: channel,
    text: "a new message from bezOS!",
    blocks: block,
  })) as ChatPostMessageResult;
};

export const getRoutes = (app: App): void => {
  app.message("generate", async ({ client }) => {
    const { startTime, endTime } = generateStartAndEndTimes();

    const question = await poseQuestion(startTime, endTime);

    const channel = "C01PDG2U3FY";
    const slackTs = await postQuestionToChannel(client, question, channel);

    await linkQuestionToSlackPost(question, channel, slackTs);
  });

  // TODO: io-ts
  const processAnswerUserInput = (
    body: SlackAction,
    context: Context
  ): Result<UserSubmittedAnswer, { message: string }> => {
    const questionId = context.actionIdMatches[1];
    const userId = body.user.id;
    const answer = context.actionIdMatches[2];

    if (typeof questionId !== "string" || typeof answer !== "string") {
      return { kind: "failure", message: "invalid user input provided" };
    }

    return { kind: "success", questionId, userId, answer: [answer] };
  };

  // TODO this regex should be extracted and stored with the generating function - with tests :)
  app.action(
    /^Question\((.*)\).Answer\((.*)\)$/,
    async ({ ack, body, context, client }) => {
      await ack();

      const answer = processAnswerUserInput(body, context);
      if (answer.kind === "failure") {
        return;
      }

      const result = await answerQuestion(answer);

      await client.chat.postEphemeral({
        channel: body.channel?.id ?? "",
        text: parseResponseMessage(result),
        user: "U01PL9GTD26",
      });
    }
  );
};
