import {
  AnswersRepository,
  QuestionsRepository,
  QuizRepository,
  UsersRepository,
} from "../types";
import { MemoryAnswersRepository } from "./repositories/answers";
import { MemoryQuestionsRepository } from "./repositories/questions";
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
}

const db = new MemoryDb();

export { db };
