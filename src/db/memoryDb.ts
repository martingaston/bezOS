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
  scheduleQuestion(
    questionId: string,
    slackTs: string,
    startTime: Date,
    endTime: Date
  ): Promise<Result>;
  stopScheduledQuestions(currentTime: Date): Promise<StoppedQuestion[]>;
  postAnswer(answer: Answer): Promise<Result<PostAnswerSuccess>>;
};

type StoppedQuestion = {
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

type ScheduledQuestion = {
  questionId: string;
  slackTs: string;
  startTime: Date;
  endTime: Date;
  active: boolean;
};

const scheduled: ScheduledQuestion[] = [];
class MemoryDb implements QuizDatabase {
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
      if (questionFromDb.kind === "success") {
        return {
          question: questionFromDb.question,
          slackTs: question.slackTs,
          endTime: question.endTime,
        };
      }

      throw new Error("dang");
    });

    return Promise.all(stopped);
  }

  async scheduleQuestion(
    questionId: string,
    slackTs: string,
    startTime: Date,
    endTime: Date
  ): Promise<Result> {
    scheduled.push({
      questionId,
      slackTs,
      startTime,
      endTime,
      active: true,
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
    questionId,
    userId,
    answer,
  }: Answer): Promise<Result<PostAnswerSuccess>> {
    const needle = answers.findIndex(
      (row) => row.questionId === questionId && row.userId === userId
    );

    if (needle === -1) {
      answers.push({ questionId, userId, answer });
      return {
        kind: "success",
        action: "CREATED",
        questionId,
        userId,
        answer,
      };
    } else {
      if (answers[needle].answer === answer) {
        return {
          kind: "success",
          action: "NOOP",
          questionId,
          userId,
          answer,
        };
      }
      answers[needle].answer = answer;
      return {
        kind: "success",
        action: "UPDATED",
        questionId,
        userId,
        answer,
      };
    }
  }
}

export const memoryDb = (): QuizDatabase => new MemoryDb();
