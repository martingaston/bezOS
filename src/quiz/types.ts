export type Question = {
  id: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  details: {
    text: string;
    type: string;
    options: QuestionOption[];
    answer: QuestionAnswer;
  };
  round: {
    name: string;
    description: string;
  };
  source: string;
};

type QuestionOption = {
  name: string;
  text: string;
};

type QuestionAnswer = {
  value: string[];
  text: string;
};
