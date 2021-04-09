import { InsertedQuestion, InsertedRoundQuestion } from "../db/types";

export type PosedQuestion = {
  roundQuestion: InsertedRoundQuestion;
  question: InsertedQuestion;
};
