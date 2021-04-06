import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.raw(`
    CREATE TABLE IF NOT EXISTS bezos.active_round (
      active_round INT REFERENCES bezos.rounds(id)
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return await knex.raw(`
    DROP TABLE IF EXISTS bezos.active_round
  `);
}
