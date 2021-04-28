import { IDatabase, IMain } from "pg-promise";
import { db } from "..";
import { Answer, AnswersRepository, InsertedAnswer } from "../../types";

export class PgAnswersRepository implements AnswersRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}
  findAnswersByRoundQuestionId(
    roundQuestionId: string
  ): Promise<InsertedAnswer[]> {
    return db.many("SELECT * FROM bezos.answers WHERE round_question_id = $1", [
      roundQuestionId,
    ]);
  }
  async findAnswerByRoundQuestionIdAndUserIdOrNull(
    roundQuestionId: string,
    userId: string
  ): Promise<InsertedAnswer | null> {
    return await db.oneOrNone(
      "SELECT * FROM bezos.answers WHERE round_question_id = $1 AND user_id = $2",
      [roundQuestionId, userId]
    );
  }

  async updateAnswer(answer: Answer): Promise<InsertedAnswer> {
    return await db.one(
      "UPDATE bezos.answers SET answer = ${answer:json} WHERE user_id = ${userId} AND round_question_id = ${roundQuestionId} RETURNING *",
      answer
    );
  }

  async addAnswer(answer: Answer): Promise<InsertedAnswer> {
    return await this.db.one(
      "INSERT INTO bezos.answers (round_question_id, user_id, answer) VALUES (${roundQuestionId}, ${userId}, ${answer:json}) RETURNING *",
      answer
    );
  }
}
