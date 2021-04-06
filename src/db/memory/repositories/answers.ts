import { Answer, AnswersRepository, InsertedAnswer } from "../../types";

const answers: InsertedAnswer[] = [];
export class MemoryAnswersRepository implements AnswersRepository {
  async addAnswerToRoundQuestion(answer: Answer): Promise<InsertedAnswer> {
    const toInsert = { ...answer, id: 1 };
    answers.push(toInsert);

    return toInsert;
  }
}
