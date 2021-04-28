import { IDatabase, IMain } from "pg-promise";
import { db } from "..";
import { User, UserSlackNotification, UsersRepository } from "../../types";
export class PgUsersRepository implements UsersRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}
  getUserById(id: string): Promise<User> {
    return db.one("SELECT * FROM bezos.users WHERE id = $1", [id]);
  }

  async getOrAddUserFromSlack(slackUserId: string): Promise<User> {
    const slackUserIdExistsInDb = await this.db.oneOrNone<User>(
      "SELECT * FROM bezos.users_slack_notifications WHERE id = $1",
      [slackUserId]
    );

    if (slackUserIdExistsInDb) {
      return slackUserIdExistsInDb;
    }

    const newUser = await this.db.one<UserSlackNotification>(
      "INSERT INTO bezos.users VALUES (DEFAULT, DEFAULT) RETURNING *"
    );

    return this.db.one(
      "INSERT INTO bezos.users_slack_notifications (id, user_id) VALUES ($1, $2) RETURNING *",
      [slackUserId, newUser.id]
    );
  }
}
