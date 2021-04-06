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
  await db.questions.setActiveRound(round);
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
  beforeEach(() => {
    db.reset();
  });

  test("it will schedule a question when one is in the database", async () => {
    const { id } = await addInactiveRoundQuestion(db);
    expect(poseQuestion(db)).resolves.toMatchObject({ kind: "success", id });
  });

  test("it will reject when the active round has no questions", async () => {
    await addInactiveRoundQuestion(db);
    const newRound = await db.questions.addRound("test", "testing");
    await db.questions.setActiveRound(newRound);
    expect(poseQuestion(db)).rejects.toMatch(
      "There are no inactive round questions available" // TODO consistent errors across memory and pg dbs
    );
  });
});
