import { getEnv } from "../../../util/getEnv";
import { Question } from "../../types";
import { connect, Db } from "..";
import { resetDbBetweenTests } from "../../../../test/resetDbBetweenTests";

beforeEach(async () => resetDbBetweenTests());

describe("PgQuestionsRepository", () => {
  let db: Db;
  const PG_CONNECTION_STRING = `postgresql://postgres:postgres@localhost:5432/bezos_test_${getEnv(
    "JEST_WORKER_ID"
  )}`;

  beforeAll(() => {
    db = connect(PG_CONNECTION_STRING);
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  test("will add a question", async () => {
    const source = await db.questions.getOrCreateSourceFromName("TEST");
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

    await db.questions.addNewQuestion(question);

    const result = await db.one(
      `SELECT COUNT(*) FROM bezos.questions`,
      [],
      (r) => parseInt(r.count)
    );

    expect(result).toBe(1);
  });

  test("can retreive a question by id", async () => {
    const source = await db.questions.getOrCreateSourceFromName("TEST");
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

    const { id } = await db.questions.addNewQuestion(question);

    const result = await db.questions.getQuestionById(id);

    expect(result.id).toBe(id);
  });

  test("does not create a new source when the same name is given", async () => {
    await db.questions.getOrCreateSourceFromName("TEST");
    await db.questions.getOrCreateSourceFromName("TEST");

    const result = await db.one(
      `SELECT COUNT(*) FROM bezos.sources`,
      [],
      (result) => parseInt(result.count)
    );

    expect(result).toBe(1);
  });

  test("will add a round", async () => {
    const roundName = "Test Round";
    const roundDescription = "Test Description";

    await db.questions.addRound(roundName, roundDescription);

    const result = await db.one(`SELECT COUNT(*) FROM bezos.rounds`, [], (r) =>
      parseInt(r.count)
    );

    expect(result).toBe(1);
  });

  test("will schedule a round question", async () => {
    const source = await db.questions.getOrCreateSourceFromName("TEST");
    const question = await db.questions.addNewQuestion({
      text: "Test Question",
      type: "MULTIPLE_CHOICE",
      options: [],
      answer: {
        value: ["A"],
        text: "A test answer",
      },
      source: source.id,
    });
    const round = await db.questions.addRound("TEST", "Testing");

    await db.questions.scheduleRoundQuestion({
      questionId: question.id,
      roundId: round.id,
      startDate: new Date(),
      endDate: new Date(),
      active: false,
    });

    const result = await db.one(
      `SELECT COUNT(*) FROM bezos.rounds_questions`,
      [],
      (r) => parseInt(r.count)
    );

    expect(result).toBe(1);
  });

  test("will retreieve an inactive round question", async () => {
    const source = await db.questions.getOrCreateSourceFromName("TEST");
    const question = await db.questions.addNewQuestion({
      text: "Test Question",
      type: "MULTIPLE_CHOICE",
      options: [],
      answer: {
        value: ["A"],
        text: "A test answer",
      },
      source: source.id,
    });
    const round = await db.questions.addRound("TEST", "Testing");

    await db.questions.scheduleRoundQuestion({
      questionId: question.id,
      roundId: round.id,
      startDate: new Date(),
      endDate: new Date(),
      active: false,
    });

    const scheduled = await db.questions.getInactiveRoundQuestion(round);

    expect(scheduled.active).toBe(false);
    expect(scheduled.questionId).toBe(question.id);
  });
});
