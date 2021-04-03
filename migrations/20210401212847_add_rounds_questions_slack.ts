import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bezos.rounds_questions_slack_notifications (
      id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      rounds_questions_id UUID REFERENCES bezos.rounds_questions(id) NOT NULL,
      slack_channel TEXT NOT NULL,
      slack_ts TEXT NOT NULL
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS bezos.rounds_questions_slack_notifications;
  `);
}
