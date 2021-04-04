import { PostAnswerSuccess } from "../db/memory/oldMemoryDb";
import { Result } from "../types";
import { randomCelebrationEmoji } from "../util/randomCelebrationEmoji";

export const parseResponseMessage = (
  result: Result<PostAnswerSuccess>
): string => {
  if (result.kind === "failure") {
    return "There was a problem submitting your answer.";
  }

  switch (result.action) {
    case "CREATED":
      return `You answered option ${
        result.answer
      } to the question ${randomCelebrationEmoji()}`;
    case "UPDATED":
      return `You updated your answer to the question with option ${
        result.answer
      } ${randomCelebrationEmoji()}`;
    case "NOOP":
      return `Your current answer to the question is already option ${result.answer} 😎`;
  }
};
