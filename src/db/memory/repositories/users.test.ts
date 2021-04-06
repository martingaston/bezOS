import { MemoryUsersRepository } from "./users";

describe("MemoryUsersRepository", () => {
  let db: MemoryUsersRepository;

  beforeEach(async () => {
    db = new MemoryUsersRepository();
  });

  test("will not add duplicate users", async () => {
    const slackUserId = "UXXXXXXX";
    const user = await db.getOrAddUserFromSlack(slackUserId);
    const userAgain = await db.getOrAddUserFromSlack(slackUserId);

    expect(user.userId).toEqual(userAgain.userId);
  });
});
