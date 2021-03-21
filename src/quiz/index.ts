import { QuizDatabase } from "../db/memoryDb";

type QuestionResult = QuestionResultSuccess | QuestionResultFailure;

type QuestionResultSuccess = {
  kind: "success";
};

type QuestionResultFailure = {
  kind: "failure";
};

export async function answerQuestion(
  db: QuizDatabase,
  questionId: string,
  userId: string,
  answer: number
): Promise<QuestionResult> {
  const question = await db.getQuestion(questionId);
  if (question.kind === "failure") {
    return { kind: "failure" };
  }

  const postAnswerToDb = await db.postAnswer(questionId, userId, answer);
  if (postAnswerToDb !== "ok") {
    return { kind: "failure" };
  }

  return { kind: "success" };
}
