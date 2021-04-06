import { connect, Db } from "..";
import { resetDbBetweenTests } from "../../../../test/resetDbBetweenTests";
import { getEnv } from "../../../util/getEnv";

beforeEach(async () => resetDbBetweenTests());

describe("PgUsersRepository", () => {
  let db: Db;
  const PG_CONNECTION_STRING = `postgresql://postgres:postgres@localhost:5432/bezos_test_${getEnv(
    "JEST_WORKER_ID"
  )}`;

  beforeAll(() => {
    db = connect(PG_CONNECTION_STRING);
  });

  afterAll(async () => {
    await db.$pool.end();
  });

  test("will add a user", async () => {
    const slackUserId = "UXXXXXXX";
    const user = await db.users.getOrAddUserFromSlack(slackUserId);
    const userAgain = await db.users.getOrAddUserFromSlack(slackUserId);

    expect(user.userId).toEqual(userAgain.userId);

    const result = await db.one(`SELECT COUNT(*) FROM bezos.users`, [], (r) =>
      parseInt(r.count)
    );

    expect(result).toBe(1);
  });
});
