import { IDatabase, IMain } from "pg-promise";
import {
  Question,
  InsertedQuestion,
  InsertedRoundQuestion,
  Round,
  RoundQuestion,
  Source,
  QuestionsRepository,
} from "../../types";

export class PgQuestionsRepository implements QuestionsRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async addNewQuestion(question: Question): Promise<InsertedQuestion> {
    return this.db.one(
      "INSERT INTO bezos.questions (text, type, options, answer, source) VALUES (${text}, ${type}, ${options:json}, ${answer}, ${source}) RETURNING *;",
      question
    );
  }

  async getOrCreateSourceFromName(name: string): Promise<Source> {
    return this.db.one(
      "INSERT INTO bezos.sources (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = bezos.sources.name RETURNING *",
      name
    );
  }

  async addRound(name: string, description: string): Promise<Round> {
    return this.db.one(
      "INSERT INTO bezos.rounds (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
  }

  async scheduleRoundQuestion(
    roundQuestion: RoundQuestion
  ): Promise<InsertedRoundQuestion> {
    return this.db.one(
      "INSERT INTO bezos.rounds_questions (question_id, round_id, active) VALUES (${questionId}, ${roundId}, FALSE) RETURNING *",
      roundQuestion
    );
  }
}
