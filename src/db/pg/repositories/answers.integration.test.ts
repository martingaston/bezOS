import { connect, Db } from "..";
import { resetDbBetweenTests } from "../../../../test/resetDbBetweenTests";
import { getEnv } from "../../../util/getEnv";

beforeEach(async () => resetDbBetweenTests());

describe("PgAnswersRepository", () => {
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

  test("will add an answer", async () => {
    const slackUserId = "UXXXXXXX";
    const source = await db.questions.getOrCreateSourceFromName("TEST");
    const round = await db.questions.addRound(
      "Test Round",
      "a round just for testing"
    );
    const question = await db.questions.addNewQuestion({
      text: "TEST QUESTION",
      type: "MULTIPLE_CHOICE",
      options: [
        {
          name: "A",
          text: "TEST ANSWER A",
        },
        {
          name: "B",
          text: "TEST ANSWER B",
        },
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
      startDate: new Date(),
      endDate: new Date(),
      active: false,
    });
    const user = await db.users.getOrAddUserFromSlack(slackUserId);

    await db.answers.addAnswerToRoundQuestion({
      roundQuestionId: roundQuestion.id,
      userId: user.userId,
      answer: ["A"],
    });

    const result = await db.one(`SELECT COUNT(*) FROM bezos.answers`, [], (r) =>
      parseInt(r.count)
    );

    expect(result).toBe(1);
  });
});
