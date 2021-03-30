import { WebAPICallResult } from "@slack/web-api";

// Result is a discriminated union type, taking two constrained generics and made up of intersection types for Failure and Success
// Also uses a default parameter incase you don't want to add extra bells and whistles to your response
// Going against convention and using Success on the Left side to make Errors optional
export type Result<
  T extends Record<string, unknown> = { kind: "success" },
  E extends Record<string, unknown> = { kind: "failure" }
> = ResultSuccess<T> | ResultFailure<E>;

type ResultSuccess<T> = {
  kind: "success";
} & T;

type ResultFailure<E> = {
  kind: "failure";
} & E;

export type Answer = {
  scheduledId: string;
  questionId: string;
  userId: string;
  answer: string;
};

// unfortunate workaround - see https://slack.dev/node-slack-sdk/typescript
export interface SlackChatPostMessageResult extends WebAPICallResult {
  channel: string;
  ts: string;
  message: {
    text: string;
  };
}
