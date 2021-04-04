export interface QuizRepository {
  questions: QuestionsRepository;
}

export interface QuestionsRepository {
  addNewQuestion(question: Question): Promise<InsertedQuestion>;
  getOrCreateSourceFromName(name: string): Promise<Source>;
  addRound(name: string, description: string): Promise<Round>;
  scheduleRoundQuestion(
    roundQuestion: RoundQuestion
  ): Promise<InsertedRoundQuestion>;
}

export type QuestionType = "MULTIPLE_CHOICE" | "MULTIPLE_RESPONSE";

export type Question = {
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

export type Source = {
  id: string;
  name: string;
};

export type Round = {
  id: number;
  name: string;
  description: string;
};

export type RoundQuestion = {
  questionId: number;
  roundId: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
};

export type InsertedRoundQuestion = RoundQuestion & uuidId;
