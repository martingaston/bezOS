import pgPromise, { IDatabase, ITask } from "pg-promise";
import { getEnv } from "../../util/getEnv";
import { PgQuestionsRepository } from "./repositories";
import camelcaseKeys from "camelcase-keys";
import { QuizRepository } from "../types";
import { PgAnswersRepository } from "./repositories/answers";
import { PgUsersRepository } from "./repositories/users";

type Db = IDatabase<QuizRepository> & QuizRepository;
type Tx = ITask<QuizRepository> & QuizRepository;

const initOptions = {
  // TODO is there any way to get this type checked? Does not currently alert when interface changes
  extend(obj: Db) {
    obj.questions = new PgQuestionsRepository(obj, pgp);
    obj.answers = new PgAnswersRepository(obj, pgp);
    obj.users = new PgUsersRepository(obj, pgp);
  },
  // TODO type this properly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receive(data: any, result: any) {
    result.rows = camelcaseKeys(data);
  },
};

const pgp = pgPromise(initOptions);
const db = pgp(getEnv("PG_CONNECTION_STRING"));

const connect = (connectionString: string): Db => pgp(connectionString);

export { connect, pgp, db, Tx, Db };
