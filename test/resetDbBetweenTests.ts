import knex from "knex";
import { getEnv } from "../src/util/getEnv";

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
