import { randomCelebrationEmoji } from "../util/randomCelebrationEmoji";
import { Answer } from "./answerQuestion";

export const parseResponseMessage = (answer: Answer): string => {
  switch (answer.action) {
    case "CREATED":
      return `You answered option ${
        answer.answer
      } to the question ${randomCelebrationEmoji()}`;
    case "UPDATED":
      return `You updated your answer to the question with option ${
        answer.answer
      } ${randomCelebrationEmoji()}`;
    case "NOOP":
      return `Your current answer to the question is already option ${answer.answer} 😎`;
  }
};
