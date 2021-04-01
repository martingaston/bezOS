import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TYPE bezos.question_type AS ENUM ('MULTIPLE_CHOICE', 'MULTIPLE_RESPONSE');

    CREATE TABLE IF NOT EXISTS bezos.sources (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS bezos.questions (
      id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      text TEXT NOT NULL,
      type bezos.question_type NOT NULL,
      options JSONB NOT NULL,
      answer JSONB NOT NULL,
      source UUID REFERENCES bezos.sources(id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS bezos.questions;
    DROP TABLE IF EXISTS bezos.sources; 
    DROP TYPE bezos.question_type;
  `);
}
