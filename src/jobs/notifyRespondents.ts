import { QuizDatabase } from "../db/memoryDb";
import { WebClient } from "@slack/web-api";

// TODO this gets the first finished question that needs users to be notified and processes it
export const notifyRespondents = async (
  db: QuizDatabase,
  client: WebClient
): Promise<void> => {
  const needsNotifying = await db.getUnnotifedFinishedQuestions();
  if (needsNotifying.length === 0) {
    return;
  }

  const notify = await db.getAnswersByScheduledId(needsNotifying[0]);
  if (notify.length === 0) {
    return;
  }

  const question = await db.getQuestion(notify[0].questionId);
  if (question.kind === "failure") {
    throw "whoops";
  }
  const correctAnswer = question.question.answer;

  notify.forEach((answer) => {
    if (answer.answer === correctAnswer) {
      client.chat.postMessage({
        channel: answer.userId,
        text: `You got it right! The answer was ${correctAnswer}!`,
      });
    } else {
      client.chat.postMessage({
        channel: answer.userId,
        text: `You got it wrong. Your answer was ${answer.answer}; the correct answer was ${correctAnswer}`,
      });
    }
  });

  await db.setScheduledQuestionToNotifiedById(needsNotifying[0]);
};
