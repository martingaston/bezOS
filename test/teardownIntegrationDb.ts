import knex from "knex";
import { getEnv } from "../src/util/getEnv";

(async () => {
  const db = knex({
    client: "postgresql",
    connection: "postgresql://postgres:postgres@localhost:5432",
  });

  await db.raw(`DROP DATABASE IF EXISTS bezos_test`);

  const test_dbs = Array.from(
    { length: parseInt(getEnv("JEST_WORKERS")) },
    (_, i) => i + 1
  ).map(async (workerIndex) => {
    const workerDbName = `bezos_test_${workerIndex}`;
    await db.raw(`DROP DATABASE IF EXISTS ${workerDbName}`);
  });

  await Promise.all(test_dbs);
  await db.destroy();
})();
