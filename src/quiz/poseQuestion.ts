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
  db: QuizRepository,
  startTime: Date,
  endTime: Date
): Promise<PosedQuestion & QuizResult> => {
  try {
    const activeRoundQuestion = await db.questions.activateRoundQuestion(
      startTime,
      endTime
    );

    const question = await db.questions.getQuestionById(
      activeRoundQuestion.questionId
    );

    const result: QuizResultSuccess = { kind: "success" };

    return Promise.resolve({
      roundQuestion: activeRoundQuestion,
      question,
      ...result,
    });
  } catch (e) {
    return Promise.reject(new Error(`Error posing a new question: ${e}`));
  }
};
