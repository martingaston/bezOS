import pgPromise, { IDatabase, ITask } from "pg-promise";
import { getEnv } from "../../util/getEnv";
import { DbExtensions, QuestionsRepository } from "./repositories";
import camelcaseKeys from "camelcase-keys";

type Db = IDatabase<DbExtensions> & DbExtensions;
type Tx = ITask<DbExtensions> & DbExtensions;

const initOptions = {
  extend(obj: Db) {
    obj.questions = new QuestionsRepository(obj, pgp);
  },
  // TODO type this properly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receive(data: any, result: any) {
    result.rows = camelcaseKeys(data);
  },
};

const pgp = pgPromise(initOptions);
const db = pgp(getEnv("PG_CONNECTION_STRING"));

export { pgp, db, Tx };
