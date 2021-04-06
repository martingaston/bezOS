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

let activeRound: number | null = null;

const nextIntId = <T>(arr: T[]): number => arr.length + 1;

export class MemoryQuestionsRepositorySpy {
  public questions = questions;
  public rounds = rounds;
  public rounds_questions = rounds_questions;
  public sources = sources;
  public activeRound = (): number | null => activeRound;
}

export class MemoryQuestionsRepository implements QuestionsRepository {
  async setActiveRound(round: Round): Promise<void> {
    activeRound = round.id;
  }

  async getQuestionById(id: number): Promise<InsertedQuestion> {
    const found = questions.find((question) => question.id === id);

    if (found === undefined) {
      return Promise.reject(new Error("No question found with that id"));
    }

    return found;
  }

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

  async getInactiveRoundQuestion(round: Round): Promise<RoundQuestion> {
    const found = rounds_questions.find(
      (roundQuestion) =>
        roundQuestion.roundId === round.id && roundQuestion.active === false
    );

    if (found === undefined) {
      return Promise.reject();
    }

    return found;
  }

  async scheduleRoundQuestion(
    roundQuestion: RoundQuestion
  ): Promise<InsertedRoundQuestion> {
    const inserted = { ...roundQuestion, id: uuidv4() };
    rounds_questions.push(inserted);
    return inserted;
  }
}

const clearArray = <T>(array: T[]): void => {
  while (array.length) {
    array.pop();
  }
};

const createNewDb = () => {
  clearArray(questions);
  clearArray(rounds);
  clearArray(rounds_questions);
  clearArray(sources);
  activeRound = null;
  return new MemoryQuestionsRepository();
};

export const createNewMemoryDb = (): MemoryQuestionsRepository => createNewDb();
