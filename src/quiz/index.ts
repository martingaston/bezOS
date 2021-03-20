type QuestionResult = QuestionResultSuccess | QuestionResultFailure;

type QuestionResultSuccess = {
  kind: "success";
};

type QuestionResultFailure = {
  kind: "failure";
};

export function answerQuestion(
  questionId: string,
  userId: string,
  answer: number
): QuestionResult {
  return { kind: "success" };
}
