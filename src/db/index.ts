import pgPromise, { IDatabase } from "pg-promise";
import { getEnv } from "../util/getEnv";
import { DbExtensions, QuestionsRepository } from "./repositories";

type ExtendedProtocol = IDatabase<DbExtensions> & DbExtensions;

const initOptions = {
  extend(obj: ExtendedProtocol) {
    obj.questions = new QuestionsRepository(obj, pgp);
  },
};

const pgp = pgPromise(initOptions);
const db = pgp(getEnv("PG_CONNECTION_STRING"));

export { pgp, db };
