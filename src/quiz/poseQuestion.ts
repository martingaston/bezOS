import { Question, QuizRepository } from "../db/types";

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

export const poseQuestion = (
  db: QuizRepository
): Promise<Question & QuizResult> => {
  const question: Question = {
    text: "A Question",
    type: "MULTIPLE_CHOICE",
    options: [{ name: "A", text: "stuff" }],
    answer: { value: ["A"], text: "a is the right answer " },
    source: "source-uuid",
  };

  const result: QuizResultSuccess = { kind: "success" };

  return Promise.resolve({ ...question, ...result });
};
