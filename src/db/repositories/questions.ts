import { IDatabase, IMain } from "pg-promise";

type QuestionType = "MULTIPLE_CHOICE" | "MULTIPLE_RESPONSE";

type Question = {
  text: string;
  type: QuestionType;
  options: Record<string, unknown>;
  answer: string;
  source: string;
};

type Source = {
  id: string;
  name: string;
};

export class QuestionsRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async addNewQuestion(question: Question): Promise<Question> {
    return this.db.one(
      "INSERT INTO bezos.questions (text, type, options, answer, source) VALUES (${text}, ${type}, ${options}, ${answer}, ${source}) RETURNING *;",
      question
    );
  }

  async getOrCreateSourceFromName(name: string): Promise<Source> {
    return this.db.one(
      "INSERT INTO bezos.sources (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = bezos.sources.name RETURNING *",
      name
    );
  }
}
