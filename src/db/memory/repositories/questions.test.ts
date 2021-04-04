import { Question, Source } from "../../types";
import {
  MemoryQuestionsRepository,
  MemoryQuestionsRepositorySpy,
} from "./questions";

describe("MemoryQuestionsRepository", () => {
  let db: MemoryQuestionsRepository;
  let spy: MemoryQuestionsRepositorySpy;
  let source: Source;

  beforeEach(async () => {
    db = new MemoryQuestionsRepository();
    spy = new MemoryQuestionsRepositorySpy();
    source = await db.getOrCreateSourceFromName("Test Source");
  });

  test("will add new question", async () => {
    const question: Question = {
      text: "Test Question",
      type: "MULTIPLE_CHOICE",
      options: [],
      answer: {
        value: ["A"],
        text: "A test answer",
      },
      source: source.id,
    };

    await db.addNewQuestion(question);

    expect(spy.questions.length).toBe(1);
  });

  test("will not create duplicate sources", async () => {
    const sourceName = "Test Source";

    const firstCall = await db.getOrCreateSourceFromName(sourceName);
    const secondCall = await db.getOrCreateSourceFromName(sourceName);

    expect(firstCall.id).toEqual(secondCall.id);
  });

  test("will add a round", async () => {
    const roundName = "Test Round";
    const roundDescription = "Test Description";

    await db.addRound(roundName, roundDescription);

    expect(spy.rounds.length).toBe(1);
  });

  test("will schedule a round question", async () => {
    await db.scheduleRoundQuestion({
      questionId: 1,
      roundId: 1,
      startDate: new Date(),
      endDate: new Date(),
      active: false,
    });

    expect(spy.rounds.length).toBe(1);
  });
});
