import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS bezos.rounds_questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question_id INT REFERENCES bezos.questions(id) NOT NULL,
      round_id INT REFERENCES bezos.rounds(id) NOT NULL,
      start_date TIMESTAMP WITH TIME ZONE,
      end_date TIMESTAMP WITH TIME ZONE,
      active BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bezos.rounds_questions_notifications (
      id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      rounds_questions_id UUID REFERENCES bezos.rounds_questions(id) NOT NULL,
      notified BOOLEAN NOT NULL
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS bezos.rounds_questions_notifications;
    DROP TABLE IF EXISTS bezos.rounds_questions; 
  `);
}
