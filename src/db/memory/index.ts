import {
  AnswersRepository,
  QuestionsRepository,
  QuizRepository,
  UsersRepository,
} from "../types";
import { MemoryAnswersRepository } from "./repositories/answers";
import {
  MemoryQuestionsRepository,
  createNewMemoryDb,
} from "./repositories/questions";
import { MemoryUsersRepository } from "./repositories/users";

class MemoryDb implements QuizRepository {
  questions: QuestionsRepository;
  users: UsersRepository;
  answers: AnswersRepository;

  constructor() {
    this.questions = new MemoryQuestionsRepository();
    this.users = new MemoryUsersRepository();
    this.answers = new MemoryAnswersRepository();
  }

  reset() {
    this.questions = createNewMemoryDb();
  }
}

const db = new MemoryDb();

export { db };
