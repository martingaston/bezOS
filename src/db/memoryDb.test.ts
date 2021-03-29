import { memoryDb, QuizDatabase } from "./memoryDb";

// these tests are pretty ghastly and need tidying up, along with the API
describe("memoryDb", () => {
  let db: QuizDatabase;

  beforeEach(() => {
    db = memoryDb();
  });

  test("can stop a question", async () => {
    const question = await db.getQuestion(
      "ab75bf4f-61a5-43c9-b1fd-486901654b2e"
    );
    const slackTs = "12345";
    const startTime = new Date(100);
    const endTime = new Date(105);
    const tooEarlyTime = new Date(103);
    const currentTime = new Date(105);

    if (question.kind === "failure") {
      fail("did not find a valid question");
    }

    const result = await db.scheduleQuestion(
      question.question.id,
      slackTs,
      startTime,
      endTime
    );

    await db.scheduleQuestion(
      question.question.id,
      "6789",
      new Date(103),
      new Date(110)
    );

    expect(result.kind).toBe("success");

    // if the question is still active it won't be stopped
    const stoppedTooEarly = await db.stopScheduledQuestions(tooEarlyTime);
    expect(stoppedTooEarly.length).toBe(0);

    // if it's stopped on the same second it will be stopped
    const stopped = await db.stopScheduledQuestions(currentTime);
    expect(stopped.length).toBe(1);
    expect(stopped[0].slackTs).toBe("12345");

    // running the function again after it's already been stopped will return an empty array
    const stoppedAgain = await db.stopScheduledQuestions(currentTime);
    expect(stoppedAgain.length).toBe(0);

    // running the function after the second question has stopped will also stop it
    const stoppedSecondQuestion = await db.stopScheduledQuestions(
      new Date(110)
    );
    expect(stoppedSecondQuestion.length).toBe(1);
    expect(stoppedSecondQuestion[0].slackTs).toBe("6789");
  });
});
