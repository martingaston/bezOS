import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bezos.answers (
      id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      round_question_id UUID REFERENCES bezos.rounds_questions(id),
      user_id UUID REFERENCES bezos.users(id),
      answer JSONB NOT NULL
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS bezos.answers 
  `);
}
