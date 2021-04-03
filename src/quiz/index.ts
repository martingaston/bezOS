import { PostAnswerSuccess, QuizDatabase } from "../db/memory/memoryDb";
import { Answer, Result } from "../types";

export async function answerQuestion(
  db: QuizDatabase,
  answer: Answer
): Promise<Result<PostAnswerSuccess>> {
  const question = await db.getQuestion(answer.questionId);
  if (question.kind === "failure") {
    return { kind: "failure" };
  }

  const postAnswerToDb = await db.postAnswer(answer);
  if (postAnswerToDb.kind === "failure") {
    return { kind: "failure" };
  }

  return postAnswerToDb;
}
