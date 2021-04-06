import { Answer } from "../../types";
import { MemoryAnswersRepository } from "./answers";

describe("MemoryUsersRepository", () => {
  let db: MemoryAnswersRepository;

  beforeEach(async () => {
    db = new MemoryAnswersRepository();
  });

  test("will add an answer", async () => {
    const answer: Answer = {
      roundQuestionId: "roundquestionid-uuid-here",
      userId: "user-uuid-here",
      answer: ["A"],
    };

    const result = await db.addAnswerToRoundQuestion(answer);
    expect(result.id).toBe(1);
  });
});
