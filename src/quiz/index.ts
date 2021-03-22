import { PostAnswerSuccess, QuizDatabase } from "../db/memoryDb";
import { Result } from "../types";

export async function answerQuestion(
  db: QuizDatabase,
  questionId: string,
  userId: string,
  answer: string
): Promise<Result<PostAnswerSuccess>> {
  const question = await db.getQuestion(questionId);
  if (question.kind === "failure") {
    return { kind: "failure" };
  }

  const postAnswerToDb = await db.postAnswer(questionId, userId, answer);
  if (postAnswerToDb.kind === "failure") {
    return { kind: "failure" };
  }

  return postAnswerToDb;
}
