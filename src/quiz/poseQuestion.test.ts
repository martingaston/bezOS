import { db } from "../db/memory";
import { QuizRepository } from "../db/types";
import { poseQuestion } from "./poseQuestion";

const addInactiveRoundQuestion = async (
  db: QuizRepository,
  startDate: Date = new Date(),
  endDate: Date = new Date()
) => {
  const source = await db.questions.getOrCreateSourceFromName("TEST");
  const round = await db.questions.addRound(
    "TEST ROUND",
    "A round for testing"
  );
  const question = await db.questions.addNewQuestion({
    text: "What's the first letter of the English alphabet?",
    type: "MULTIPLE_CHOICE",
    options: [
      { name: "A", text: "Option A" },
      { name: "B", text: "Option B" },
    ],
    answer: {
      value: ["A"],
      text: "A is the correct answer",
    },
    source: source.id,
  });
  const roundQuestion = await db.questions.scheduleRoundQuestion({
    questionId: question.id,
    roundId: round.id,
    startDate: startDate,
    endDate: endDate,
    active: false,
  });

  return roundQuestion;
};

describe("poseQuestion", () => {
  test("it will schedule a question when one is in the database", async () => {
    addInactiveRoundQuestion(db);
    expect(poseQuestion(db)).resolves.toMatchObject({ kind: "success" });
  });

  xtest("it will reject when the database has no questions in it", () => {
    addInactiveRoundQuestion(db);
    expect(poseQuestion(db)).rejects.toMatch("error");
  });
});
