import pgPromise, { IDatabase, ITask } from "pg-promise";
import { getEnv } from "../../util/getEnv";
import { PgQuestionsRepository } from "./repositories";
import camelcaseKeys from "camelcase-keys";
import { QuizRepository } from "../types";

type Db = IDatabase<QuizRepository> & QuizRepository;
type Tx = ITask<QuizRepository> & QuizRepository;

const initOptions = {
  extend(obj: Db) {
    obj.questions = new PgQuestionsRepository(obj, pgp);
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
