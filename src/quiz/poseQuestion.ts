import { QuizRepository } from "../db/types";
import { PosedQuestion } from "./types";

type QuizAction = "SCHEDULED";

type QuizResult = QuizResultSuccess | QuizResultFailure;

type QuizResultSuccess = {
  kind: "success";
  action?: QuizAction;
};

type QuizResultFailure = {
  kind: "failure";
  error?: string;
};

export const poseQuestion = async (
  db: QuizRepository
): Promise<PosedQuestion & QuizResult> => {
  const round = await db.questions.getActiveRound();
  const roundQuestion = await db.questions.getInactiveRoundQuestion(round);
  const question = await db.questions.getQuestionById(roundQuestion.questionId);
  const result: QuizResultSuccess = { kind: "success" };

  return Promise.resolve({ id: roundQuestion.id, question, ...result });
};
