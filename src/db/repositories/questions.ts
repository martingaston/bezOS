import { IDatabase, IMain } from "pg-promise";

export type QuestionType = "MULTIPLE_CHOICE" | "MULTIPLE_RESPONSE";

type Question = {
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  answer: QuestionAnswer;
  source: string;
};

type intId = {
  id: number;
};

type uuidId = {
  id: string;
};

export type InsertedQuestion = Question & intId;

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

type Round = {
  id: number;
  name: string;
  description: string;
};

type RoundQuestion = {
  questionId: number;
  roundId: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
};

type InsertedRoundQuestion = RoundQuestion & uuidId;

export class QuestionsRepository {
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
