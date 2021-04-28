import { Answer, AnswersRepository, InsertedAnswer } from "../../types";

const answers: InsertedAnswer[] = [];
export class MemoryAnswersRepository implements AnswersRepository {
  findAnswersByRoundQuestionId(
    roundQuestionId: string
  ): Promise<InsertedAnswer[]> {
    throw new Error("Method not implemented.");
  }
  async findAnswerByRoundQuestionIdAndUserIdOrNull(
    roundQuestionId: string,
    userId: string
  ): Promise<InsertedAnswer | null> {
    throw new Error("Method not implemented.");
  }
  async updateAnswer(answer: Answer): Promise<InsertedAnswer> {
    throw new Error("Method not implemented.");
  }
  async addAnswer(answer: Answer): Promise<InsertedAnswer> {
    const toInsert = { ...answer, id: 1 };
    answers.push(toInsert);

    return toInsert;
  }
}
