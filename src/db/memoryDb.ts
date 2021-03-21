export type QuizDatabase = {
  getQuestion(questionId: string): Promise<string>;
  postAnswer(
    questionId: string,
    userId: string,
    answer: number
  ): Promise<string>;
};

const questions = [
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

class MemoryDb implements QuizDatabase {
  async getQuestion(questionId: string): Promise<string> {
    const result = questions.find((row) => row.id === questionId);

    if (result) {
      return "ok";
    }

    return "error";
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
