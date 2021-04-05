import { IDatabase, IMain } from "pg-promise";
import { User, UsersRepository } from "../../types";

export class PgUsersRepository implements UsersRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  getOrAddUserFromSlack(slackUserId: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
