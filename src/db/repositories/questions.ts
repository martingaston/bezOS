import { IDatabase, IMain } from "pg-promise";

export type QuestionType = "MULTIPLE_CHOICE" | "MULTIPLE_RESPONSE";

export type Question = {
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  answer: QuestionAnswer;
  source: string;
};

type QuestionOption = {
  name: string;
  text: string;
};

type QuestionAnswer = {
  value: string[];
  text: string;
};

type Source = {
  id: string;
  name: string;
};

export class QuestionsRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async addNewQuestion(question: Question): Promise<Question> {
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
}
