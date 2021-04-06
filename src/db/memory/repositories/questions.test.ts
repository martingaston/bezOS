import { Question, Source } from "../../types";
import {
  createNewMemoryDb,
  MemoryQuestionsRepository,
  MemoryQuestionsRepositorySpy,
} from "./questions";

describe("MemoryQuestionsRepository", () => {
  let db: MemoryQuestionsRepository;
  let spy: MemoryQuestionsRepositorySpy;
  let source: Source;

  beforeEach(async () => {
    db = createNewMemoryDb();
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

  test("can get a question", async () => {
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

    const { id } = await db.addNewQuestion(question);

    const result = await db.getQuestionById(id);

    expect(result.id).toBe(id);
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

  test("will find an inactive round question", async () => {
    const round = await db.addRound("Test Round", "this is a test round");
    const question = await db.addNewQuestion({
      text: "Test Question",
      type: "MULTIPLE_CHOICE",
      options: [{ name: "A", text: "Test" }],
      answer: { value: ["A"], text: "A is the answer" },
      source: "source-uuid-here",
    });
    const roundQuestion = await db.scheduleRoundQuestion({
      questionId: question.id,
      roundId: round.id,
      startDate: new Date(),
      endDate: new Date(),
      active: false,
    });

    const result = await db.getInactiveRoundQuestion(round);
    expect(result.questionId).toEqual(question.id);
  });

  test("will schedule a round question", async () => {
    await db.scheduleRoundQuestion({
      questionId: 1,
      roundId: 1,
      startDate: new Date(),
      endDate: new Date(),
      active: false,
    });

    expect(spy.rounds_questions.length).toBe(1);
  });

  test("will set the active round", async () => {
    const round = await db.addRound("Test Round", "This is a testing round");

    await db.setActiveRound(round);

    expect(spy.activeRound()).toBe(round.id);
  });
});
