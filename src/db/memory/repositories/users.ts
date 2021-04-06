import { User, UserSlackNotification, UsersRepository } from "../../types";
import { v4 as uuidv4 } from "uuid";

const usersSlackNotifications: UserSlackNotification[] = [];

export class MemoryUsersRepository implements UsersRepository {
  async getOrAddUserFromSlack(slackUserId: string): Promise<User> {
    const user = usersSlackNotifications.find(
      (user) => user.id === slackUserId
    );

    if (user !== undefined) {
      return {
        slackId: user.id,
        userId: user.userId,
      };
    }

    const newUser = { id: slackUserId, userId: uuidv4() };
    usersSlackNotifications.push(newUser);

    return {
      slackId: newUser.id,
      userId: newUser.userId,
    };
  }
}
