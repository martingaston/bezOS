import { v4 as uuidv4 } from "uuid";
import {
  InsertedQuestion,
  InsertedRoundQuestion,
  Question,
  QuestionsRepository,
  Round,
  RoundQuestion,
  RoundQuestionNotification,
  RoundQuestionSlackNotification,
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
  setRoundQuestionNotificationToNotifiedById(
    id: number
  ): Promise<RoundQuestionNotification> {
    throw new Error("Method not implemented.");
  }
  getUnnotifiedRoundsQuestionsNotifications(): Promise<
    RoundQuestionNotification[]
  > {
    throw new Error("Method not implemented.");
  }
  getRoundQuestionById(
    roundQuestionId: string
  ): Promise<InsertedRoundQuestion> {
    throw new Error("Method not implemented.");
  }
  addRoundQuestionNotificationByRoundQuestionId(
    roundQuestionId: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getRoundQuestionSlackNotificationByRoundQuestionId(
    roundQuestionId: string
  ): Promise<RoundQuestionSlackNotification> {
    throw new Error("Method not implemented.");
  }
  deactivateRoundQuestionsOlderThanDate(
    date: Date
  ): Promise<InsertedRoundQuestion[]> {
    throw new Error("Method not implemented.");
  }
  getRound(id: number): Promise<Round> {
    throw new Error("Method not implemented.");
  }
  getSource(uuid: string): Promise<Source> {
    throw new Error("Method not implemented.");
  }
  addRoundQuestionSlackNotification(
    roundQuestionId: string,
    channel: string,
    slackTs: string
  ): Promise<RoundQuestionSlackNotification> {
    throw new Error("Method not implemented.");
  }
  async activateRoundQuestion(
    startDate: Date,
    endDate: Date
  ): Promise<InsertedRoundQuestion> {
    const index = rounds_questions.findIndex(
      (rq) => rq.roundId === activeRound && rq.active === false
    );

    if (index === -1) {
      return Promise.reject(
        "No inactive roundQuestion was found in the database"
      );
    }

    rounds_questions[index] = {
      ...rounds_questions[index],
      startDate,
      endDate,
      active: true,
    };

    return rounds_questions[index];
  }

  async getActiveRound(): Promise<Round> {
    const round = rounds.filter((round) => round.id === activeRound);
    if (round.length !== 1) {
      return Promise.reject("Something went wrong");
    }

    return round[0];
  }

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

  async getInactiveRoundQuestion(round: Round): Promise<InsertedRoundQuestion> {
    const found = rounds_questions.find(
      (roundQuestion) =>
        roundQuestion.roundId === round.id && roundQuestion.active === false
    );

    if (found === undefined) {
      return Promise.reject("There are no inactive round questions available");
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
