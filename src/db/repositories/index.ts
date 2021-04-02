import { QuestionsRepository } from "./questions";

interface DbExtensions {
  questions: QuestionsRepository;
}

export { QuestionsRepository, DbExtensions };
