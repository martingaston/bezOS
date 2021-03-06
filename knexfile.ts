import dotenv from "dotenv";
import { getEnv } from "./src/util/getEnv";

dotenv.config();

module.exports = {
  test: {
    client: "postgresql",
    connection: getEnv("PG_CONNECTION_STRING_TEST"),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  development: {
    client: "postgresql",
    connection: getEnv("PG_CONNECTION_STRING"),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: getEnv("PG_CONNECTION_STRING"),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
