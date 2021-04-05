import { IDatabase, IMain } from "pg-promise";
import { Answer, AnswersRepository, InsertedAnswer } from "../../types";

export class PgAnswersRepository implements AnswersRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}
  addAnswerToRoundQuestion(answer: Answer): Promise<InsertedAnswer> {
    return this.db.one(
      "INSERT INTO bezos.answers (round_question_id, user_id, answer) VALUES (${roundQuestionId}, ${userId}, ${answer:json}) RETURNING *",
      answer
    );
  }
}
