import { QuestionsRepository, QuizRepository } from "../types";
import { MemoryQuestionsRepository } from "./repositories/questions";

class MemoryDb implements QuizRepository {
  questions: QuestionsRepository;

  constructor() {
    this.questions = new MemoryQuestionsRepository();
  }
}

const db = new MemoryDb();

export { db };
