export interface QuizRepository {
  questions: QuestionsRepository;
  users: UsersRepository;
  answers: AnswersRepository;
}

export interface UsersRepository {
  getOrAddUserFromSlack(slackUserId: string): Promise<UserSlackNotification>;
  getUserById(id: string): Promise<UserSlackNotification>;
}

export type User = {
  id: string;
  createdAt: Date;
};

export type UserSlackNotification = {
  id: string;
  userId: string;
};

export interface AnswersRepository {
  addAnswer(answer: Answer): Promise<InsertedAnswer>;
  findAnswerByRoundQuestionIdAndUserIdOrNull(
    roundQuestionId: string,
    userId: string
  ): Promise<InsertedAnswer | null>;
  findAnswersByRoundQuestionId(
    roundQuestionId: string
  ): Promise<InsertedAnswer[]>;
  updateAnswer(answer: Answer): Promise<InsertedAnswer>;
}

export type Answer = {
  roundQuestionId: string;
  userId: string;
  answer: string[];
};

export type InsertedAnswer = Answer & intId;

export interface QuestionsRepository {
  addNewQuestion(question: Question): Promise<InsertedQuestion>;
  getQuestionById(id: number): Promise<InsertedQuestion>;
  getOrCreateSourceFromName(name: string): Promise<Source>;
  getRound(id: number): Promise<Round>;
  getSource(uuid: string): Promise<Source>;
  addRound(name: string, description: string): Promise<Round>;
  getRoundQuestionSlackNotificationByRoundQuestionId(
    roundQuestionId: string
  ): Promise<RoundQuestionSlackNotification>;
  addRoundQuestionNotificationByRoundQuestionId(
    roundQuestionId: string
  ): Promise<void>;
  getUnnotifiedRoundsQuestionsNotifications(): Promise<
    RoundQuestionNotification[]
  >;
  setRoundQuestionNotificationToNotifiedById(
    id: number
  ): Promise<RoundQuestionNotification>;
  addRoundQuestionSlackNotification(
    roundQuestionId: string,
    channel: string,
    slackTs: string
  ): Promise<RoundQuestionSlackNotification>;
  getActiveRound(): Promise<Round>;
  setActiveRound(round: Round): Promise<void>;
  getRoundQuestionById(roundQuestionId: string): Promise<InsertedRoundQuestion>;
  getInactiveRoundQuestion(round: Round): Promise<InsertedRoundQuestion>;
  activateRoundQuestion(
    startDate: Date,
    endDate: Date
  ): Promise<InsertedRoundQuestion>;
  deactivateRoundQuestionsOlderThanDate(
    date: Date
  ): Promise<InsertedRoundQuestion[]>;
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

export type RoundQuestionNotification = {
  id: number;
  roundsQuestionsId: string;
  notified: boolean;
};

export type RoundQuestionSlackNotification = {
  id: number;
  roundsQuestionsId: string;
  slackChannel: string;
  slackTs: string;
};

export type InsertedRoundQuestion = RoundQuestion & uuidId;
