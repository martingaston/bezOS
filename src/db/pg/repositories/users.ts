import { IDatabase, IMain } from "pg-promise";
import { User, UsersRepository } from "../../types";
export class PgUsersRepository implements UsersRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}

  async getOrAddUserFromSlack(slackUserId: string): Promise<User> {
    const slackUserIdExistsInDb = await this.db.oneOrNone<User>(
      "SELECT * FROM bezos.users_slack_notifications WHERE id = $1",
      [slackUserId]
    );

    if (slackUserIdExistsInDb) {
      return slackUserIdExistsInDb;
    }

    const newUser = await this.db.one<{ id: string; createdAt: Date }>(
      "INSERT INTO bezos.users VALUES (DEFAULT, DEFAULT) RETURNING *"
    );

    return this.db.one(
      "INSERT INTO bezos.users_slack_notifications (id, user_id) VALUES ($1, $2) RETURNING *",
      [slackUserId, newUser.id]
    );
  }
}
