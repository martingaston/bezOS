import { memoryDb, QuizDatabase } from "./memoryDb";

// TODO: these tests are pretty ghastly and need tidying up, along with the API
describe("memoryDb", () => {
  let db: QuizDatabase;

  beforeEach(() => {
    db = memoryDb();
  });

  test("can stop a question", async () => {
    const question = await db.getQuestion(
      "ab75bf4f-61a5-43c9-b1fd-486901654b2e"
    );
    const scheduledId = "UUID-GOES-HERE";
    const slackTs = "12345";
    const startTime = new Date(100);
    const endTime = new Date(105);
    const tooEarlyTime = new Date(103);
    const currentTime = new Date(105);

    if (question.kind === "failure") {
      fail("did not find a valid question");
    }

    const result = await db.scheduleQuestion(
      scheduledId,
      question.question.id,
      slackTs,
      startTime,
      endTime
    );

    await db.scheduleQuestion(
      "ANOTHER-UUID",
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

  test("can return which questions need respondents to be notified", async () => {
    const question = await db.getQuestion(
      "ab75bf4f-61a5-43c9-b1fd-486901654b2e"
    );
    const scheduledId = "UUID-GOES-HERE";
    const slackTs = "12345";
    const startTime = new Date(100);
    const endTime = new Date(105);
    const currentTime = new Date(105);

    if (question.kind === "failure") {
      fail("did not find a valid question");
    }

    await db.scheduleQuestion(
      scheduledId,
      question.question.id,
      slackTs,
      startTime,
      endTime
    );

    const tooEarly = await db.getUnnotifedFinishedQuestions();
    expect(tooEarly.length).toBe(0);

    await db.stopScheduledQuestions(currentTime);

    const result = await db.getUnnotifedFinishedQuestions();
    expect(result.length).toBe(1);
  });

  xtest("will not crash if a finished question has no respondents", () => {
    fail("implement");
  });

  // TODO: this is particularly horrific
  test("can get notifications", async () => {
    const question = await db.getQuestion(
      "ab75bf4f-61a5-43c9-b1fd-486901654b2e"
    );
    const firstScheduledId = "UUID-GOES-HERE-1";
    const secondScheduledId = "UUID-GOES-HERE-2";

    const slackTs = "12345";

    const firstStartTime = new Date(100);
    const firstEndTime = new Date(105);

    const secondStartTime = new Date(200);
    const secondEndTime = new Date(205);

    if (question.kind === "failure") {
      fail("did not find a valid question");
    }

    await db.scheduleQuestion(
      firstScheduledId,
      question.question.id,
      slackTs,
      firstStartTime,
      firstEndTime
    );

    await db.postAnswer({
      scheduledId: firstScheduledId,
      questionId: question.question.id,
      userId: "1",
      answer: "B",
    });

    await db.stopScheduledQuestions(new Date(150));

    const notificationsAfterFirstQuestion = await db.getUnnotifedFinishedQuestions();
    expect(notificationsAfterFirstQuestion.length).toBe(1);

    const notify = await db.getAnswersByScheduledId(
      notificationsAfterFirstQuestion[0]
    );

    expect(notify.length).toBe(1);

    await db.setScheduledQuestionToNotifiedById(
      notificationsAfterFirstQuestion[0]
    );

    await db.scheduleQuestion(
      secondScheduledId,
      question.question.id,
      slackTs,
      secondStartTime,
      secondEndTime
    );

    await db.postAnswer({
      scheduledId: secondScheduledId,
      questionId: question.question.id,
      userId: "1",
      answer: "A",
    });

    await db.stopScheduledQuestions(new Date(250));

    const notificationsAfterSecondQuestion = await db.getUnnotifedFinishedQuestions();
    expect(notificationsAfterSecondQuestion.length).toBe(1);

    const notifySecond = await db.getAnswersByScheduledId(
      notificationsAfterSecondQuestion[0]
    );

    expect(notifySecond.length).toBe(1);
  });
});
