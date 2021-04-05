import { IDatabase, IMain } from "pg-promise";
import { Answer, AnswersRepository, InsertedAnswer } from "../../types";

export class PgAnswersRepository implements AnswersRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}
  addAnswerToRoundQuestion(
    answer: Answer,
    roundQuestionId: string
  ): Promise<InsertedAnswer> {
    throw new Error("Method not implemented.");
  }
}
