import { Answer, Result } from "../types";

type QuestionDbAction = "CREATED" | "UPDATED" | "NOOP";

type GetQuestionSuccess = {
  question: Question;
};

export type PostAnswerSuccess = {
  action: QuestionDbAction;
} & Answer;

export type QuizDatabase = {
  getQuestion(questionId: string): Promise<Result<GetQuestionSuccess>>;
  getUnnotifedFinishedQuestions(): Promise<string[]>;
  scheduleQuestion(
    scheduledId: string,
    questionId: string,
    slackTs: string,
    startTime: Date,
    endTime: Date
  ): Promise<Result>;
  stopScheduledQuestions(currentTime: Date): Promise<StoppedQuestion[]>;
  postAnswer(answer: Answer): Promise<Result<PostAnswerSuccess>>;
  getAnswersByScheduledId(scheduledId: string): Promise<Answer[]>;
  setScheduledQuestionToNotifiedById(scheduledId: string): Promise<void>;
};

type StoppedQuestion = {
  scheduledId: string;
  question: Question;
  slackTs: string;
  endTime: Date;
};

type Option = {
  name: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
  answer: string;
};

const questions: Question[] = [
  {
    id: "ab75bf4f-61a5-43c9-b1fd-486901654b2e",
    text:
      "A customer relationship management (CRM) application runs on Amazon EC2 instances in multiple Availability Zones behind an Application Load Balancer. If one of these instances fails, what occurs?",
    options: [
      {
        name: "A",
        text:
          "The load balancer will stop sending requests to the failed instance.",
      },
      {
        name: "B",
        text: "The load balancer will terminate the failed instance.",
      },
      {
        name: "C",
        text:
          "The load balancer will automatically replace the failed instance.",
      },
      {
        name: "D",
        text:
          "The load balancer will return 504 Gateway Timeout errors until the instance is replaced.",
      },
    ],
    answer: "A",
  },
];

const answers: Answer[] = [];

// asked question? set question?
type ScheduledQuestion = {
  id: string;
  questionId: string;
  startTime: Date;
  endTime: Date;
  active: boolean;
  notified: boolean;
};

type ScheduledQuestionSlackTs = {
  scheduledQuestionId: string;
  slackTs: string;
};

const scheduled: ScheduledQuestion[] = [];

const scheduledSlackTs: ScheduledQuestionSlackTs[] = [];
class MemoryDb implements QuizDatabase {
  async setScheduledQuestionToNotifiedById(scheduledId: string): Promise<void> {
    scheduled.forEach((scheduledQuestion) => {
      if (scheduledQuestion.id === scheduledId) {
        scheduledQuestion.notified = true;
      }
    });
  }

  async getAnswersByScheduledId(scheduledId: string): Promise<Answer[]> {
    return answers.filter((answer) => answer.scheduledId === scheduledId);
  }

  async getUnnotifedFinishedQuestions(): Promise<string[]> {
    return scheduled
      .filter(
        (question) => question.active === false && question.notified === false
      )
      .map((x) => x.id);
  }

  async stopScheduledQuestions(currentTime: Date): Promise<StoppedQuestion[]> {
    const finished = scheduled.filter(
      (question) =>
        question.active && question.endTime.getTime() <= currentTime.getTime()
    );

    scheduled.forEach((question) => {
      if (
        question.active &&
        question.endTime.getTime() <= currentTime.getTime()
      ) {
        question.active = false;
      }
    });

    const stopped = finished.map(async (question) => {
      const questionFromDb = await this.getQuestion(question.questionId);
      const slackTs = scheduledSlackTs.find(
        (x) => x.scheduledQuestionId === question.id
      );

      if (questionFromDb.kind === "success" && slackTs !== undefined) {
        return {
          scheduledId: question.id,
          question: questionFromDb.question,
          slackTs: slackTs.slackTs,
          endTime: question.endTime,
        };
      }

      throw new Error("dang");
    });

    return Promise.all(stopped);
  }

  async scheduleQuestion(
    scheduledId: string,
    questionId: string,
    slackTs: string,
    startTime: Date,
    endTime: Date
  ): Promise<Result> {
    scheduled.push({
      id: scheduledId,
      questionId,
      startTime,
      endTime,
      active: true,
      notified: false,
    });

    scheduledSlackTs.push({
      scheduledQuestionId: scheduledId,
      slackTs,
    });

    return { kind: "success" };
  }

  async getQuestion(questionId: string): Promise<Result<GetQuestionSuccess>> {
    const result = questions.find((row) => row.id === questionId);

    if (result) {
      return {
        kind: "success",
        question: result,
      };
    }

    return { kind: "failure" };
  }

  async postAnswer({
    scheduledId,
    questionId,
    userId,
    answer,
  }: Answer): Promise<Result<PostAnswerSuccess>> {
    const needle = answers.findIndex(
      (row) =>
        row.scheduledId === scheduledId &&
        row.questionId === questionId &&
        row.userId === userId
    );

    if (needle === -1) {
      answers.push({ scheduledId, questionId, userId, answer });
      return {
        kind: "success",
        action: "CREATED",
        scheduledId,
        questionId,
        userId,
        answer,
      };
    } else {
      if (answers[needle].answer === answer) {
        return {
          kind: "success",
          action: "NOOP",
          scheduledId,
          questionId,
          userId,
          answer,
        };
      }
      answers[needle].answer = answer;
      return {
        kind: "success",
        action: "UPDATED",
        scheduledId,
        questionId,
        userId,
        answer,
      };
    }
  }
}

const clearArray = <T>(array: T[]): void => {
  while (array.length) {
    array.pop();
  }
};

const createNewDb = () => {
  clearArray(answers);
  clearArray(scheduled);
  clearArray(scheduledSlackTs);
  return new MemoryDb();
};

export const memoryDb = (): QuizDatabase => createNewDb();
