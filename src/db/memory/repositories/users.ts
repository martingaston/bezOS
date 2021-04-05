import { User, UsersRepository } from "../../types";

export class MemoryUsersRepository implements UsersRepository {
  getOrAddUserFromSlack(slackUserId: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
