import knex from "knex";
import { getEnv } from "../src/util/getEnv";

export const createDbsAndMigrate = async (): Promise<void> => {
  const db = knex({
    client: "postgresql",
    connection: "postgresql://postgres:postgres@localhost:5432",
  });

  await db.raw(`DROP DATABASE IF EXISTS bezos_test`);
  await db.raw(`CREATE DATABASE bezos_test`);

  const migrationsConnection = knex({
    client: "postgresql",
    connection: "postgresql://postgres:postgres@localhost:5432/bezos_test",
  });

  await migrationsConnection.migrate.latest();
  await migrationsConnection.destroy();

  const test_dbs = Array.from(
    { length: parseInt(getEnv("JEST_WORKERS")) },
    (_, i) => i + 1
  ).map(async (workerIndex) => {
    const workerDbName = `bezos_test_${workerIndex}`;
    await db.raw(`DROP DATABASE IF EXISTS ${workerDbName}`);
    await db.raw(`CREATE DATABASE ${workerDbName} TEMPLATE bezos_test`);
  });

  await Promise.all(test_dbs);
  await db.destroy();
};

export const resetDbBetweenTests = async (): Promise<void> => {
  const db = knex({
    client: "postgresql",
    connection: `postgresql://postgres:postgres@localhost:5432/bezos_test_${getEnv(
      "JEST_WORKER_ID"
    )}`,
  });

  await db.raw(`
  DO
  $func$
  BEGIN
    EXECUTE (
      SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE' FROM pg_class WHERE relkind = 'r' AND relnamespace = 'bezos'::regnamespace 
    );
  END
  $func$
  `);

  await db.destroy();
};
