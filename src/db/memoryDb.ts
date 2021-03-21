export type QuizDatabase = {
  getQuestion(questionId: string): Promise<GetQuestionResult>;
  postAnswer(
    questionId: string,
    userId: string,
    answer: number
  ): Promise<string>;
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

type Answer = {
  questionId: string;
  userId: string;
  answer: number;
};

const answers: Answer[] = [];

type GetQuestionResult = GetQuestionFailure | GetQuestionSuccess;

type GetQuestionFailure = {
  kind: "failure";
};

type GetQuestionSuccess = {
  kind: "success";
  question: Question;
};

class MemoryDb implements QuizDatabase {
  async getQuestion(questionId: string): Promise<GetQuestionResult> {
    const result = questions.find((row) => row.id === questionId);

    if (result) {
      return {
        kind: "success",
        question: result,
      };
    }

    return { kind: "failure" };
  }

  async postAnswer(
    questionId: string,
    userId: string,
    answer: number
  ): Promise<string> {
    const needle = answers.findIndex(
      (row) => row.questionId === questionId && row.userId === "userId"
    );

    if (needle === -1) {
      answers.push({ questionId, userId, answer });
      return "ok";
    } else {
      answers[needle].answer = answer;
      return "ok";
    }
  }
}

export const memoryDb = (): QuizDatabase => new MemoryDb();
