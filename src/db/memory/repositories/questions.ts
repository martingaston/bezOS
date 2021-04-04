import { v4 as uuidv4 } from "uuid";
import {
  InsertedQuestion,
  InsertedRoundQuestion,
  Question,
  QuestionsRepository,
  Round,
  RoundQuestion,
  Source,
} from "../../types";

const questions: InsertedQuestion[] = [];

const rounds: Round[] = [];

const rounds_questions: InsertedRoundQuestion[] = [];

const sources: Source[] = [];

const nextIntId = <T>(arr: T[]): number => arr.length + 1;

export class MemoryQuestionsRepositorySpy {
  public questions = questions;
  public rounds = rounds;
  public rounds_questions = rounds_questions;
  public sources = sources;
}

export class MemoryQuestionsRepository implements QuestionsRepository {
  async addNewQuestion(question: Question): Promise<InsertedQuestion> {
    const inserted: InsertedQuestion = {
      id: nextIntId(questions),
      ...question,
    };
    questions.push(inserted);
    return inserted;
  }

  async getOrCreateSourceFromName(name: string): Promise<Source> {
    const needle = sources.findIndex((source) => source.name === name);
    if (needle > -1) {
      return sources[needle];
    } else {
      const inserted = { id: uuidv4(), name };
      sources.push(inserted);
      return inserted;
    }
  }

  async addRound(name: string, description: string): Promise<Round> {
    const inserted = {
      id: nextIntId(rounds),
      name,
      description,
    };
    rounds.push(inserted);
    return inserted;
  }

  async scheduleRoundQuestion(
    roundQuestion: RoundQuestion
  ): Promise<InsertedRoundQuestion> {
    const inserted = { ...roundQuestion, id: uuidv4() };
    rounds_questions.push(inserted);
    return inserted;
  }
}
