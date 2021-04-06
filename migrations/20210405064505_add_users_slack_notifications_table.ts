import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bezos.users_slack_notifications (
      id TEXT PRIMARY KEY,
      user_id UUID REFERENCES bezos.users(id) NOT NULL
    )  
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS bezos.users_slack_notifications;
  `);
}
