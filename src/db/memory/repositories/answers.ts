import { Answer, AnswersRepository, InsertedAnswer } from "../../types";

export class MemoryAnswersRepository implements AnswersRepository {
  addAnswerToRoundQuestion(answer: Answer): Promise<InsertedAnswer> {
    throw new Error("Method not implemented.");
  }
}
