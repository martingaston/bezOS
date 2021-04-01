import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw("CREATE SCHEMA IF NOT EXISTS bezos;");
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP SCHEMA IF EXISTS bezos;");
}
