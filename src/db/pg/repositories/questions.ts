import { IDatabase, IMain } from "pg-promise";
import { db } from "..";
import {
  Question,
  InsertedQuestion,
  InsertedRoundQuestion,
  Round,
  RoundQuestion,
  Source,
  QuestionsRepository,
  RoundQuestionSlackNotification,
  RoundQuestionNotification,
} from "../../types";

export class PgQuestionsRepository implements QuestionsRepository {
  constructor(private db: IDatabase<unknown>, private pgp: IMain) {}
  setRoundQuestionNotificationToNotifiedById(
    id: number
  ): Promise<RoundQuestionNotification> {
    return db.one(
      "UPDATE bezos.rounds_questions_notifications SET notified = TRUE WHERE id = $1 RETURNING *",
      [id]
    );
  }
  getUnnotifiedRoundsQuestionsNotifications(): Promise<
    RoundQuestionNotification[]
  > {
    return db.manyOrNone(
      "SELECT * FROM bezos.rounds_questions_notifications WHERE notified = FALSE"
    );
  }
  getRoundQuestionById(
    roundQuestionId: string
  ): Promise<InsertedRoundQuestion> {
    return db.one("SELECT * FROM bezos.rounds_questions WHERE id = $1", [
      roundQuestionId,
    ]);
  }
  async addRoundQuestionNotificationByRoundQuestionId(
    roundQuestionId: string
  ): Promise<void> {
    db.none(
      "INSERT INTO bezos.rounds_questions_notifications (rounds_questions_id, notified) VALUES ($1, FALSE)",
      [roundQuestionId]
    );
  }

  getRoundQuestionSlackNotificationByRoundQuestionId(
    roundQuestionId: string
  ): Promise<RoundQuestionSlackNotification> {
    return db.one(
      "SELECT * FROM bezos.rounds_questions_slack_notifications WHERE rounds_questions_id = $1",
      [roundQuestionId]
    );
  }

  deactivateRoundQuestionsOlderThanDate(
    date: Date
  ): Promise<InsertedRoundQuestion[]> {
    return db.manyOrNone(
      "UPDATE bezos.rounds_questions SET active = FALSE WHERE end_date < $1 AND active = TRUE RETURNING *",
      [date]
    );
  }

  async addRoundQuestionSlackNotification(
    roundQuestionId: string,
    channel: string,
    slackTs: string
  ): Promise<RoundQuestionSlackNotification> {
    return await this.db.one(
      "INSERT INTO bezos.rounds_questions_slack_notifications (rounds_questions_id, slack_channel, slack_ts) VALUES ($1, $2, $3) RETURNING *",
      [roundQuestionId, channel, slackTs]
    );
  }

  async getRound(id: number): Promise<Round> {
    return await this.db.one("SELECT * FROM bezos.rounds WHERE id = $1", [id]);
  }

  async getSource(uuid: string): Promise<Source> {
    return await this.db.one("SELECT * FROM bezos.sources WHERE id = $1", [
      uuid,
    ]);
  }

  async activateRoundQuestion(
    startDate: Date,
    endDate: Date
  ): Promise<InsertedRoundQuestion> {
    const round = await this.getActiveRound();
    const question = await this.getInactiveRoundQuestion(round);
    return await this.db.one(
      "UPDATE bezos.rounds_questions SET active = TRUE, start_date = $2, end_date = $3 WHERE id = $1 RETURNING *",
      [question.id, startDate, endDate]
    );
  }

  async getActiveRound(): Promise<Round> {
    return await this.db.one(
      "SELECT * FROM bezos.rounds WHERE id = (SELECT active_round FROM bezos.active_round LIMIT 1)"
    );
  }

  async setActiveRound(round: Round): Promise<void> {
    await this.db.query("TRUNCATE bezos.active_round");
    await this.db.none("INSERT INTO bezos.active_round VALUES ($1)", [
      round.id,
    ]);
  }

  async getQuestionById(id: number): Promise<InsertedQuestion> {
    return this.db.one("SELECT * FROM bezos.questions WHERE id = ${id}", {
      id,
    });
  }

  async addNewQuestion(question: Question): Promise<InsertedQuestion> {
    return this.db.one(
      "INSERT INTO bezos.questions (text, type, options, answer, source) VALUES (${text}, ${type}, ${options:json}, ${answer}, ${source}) RETURNING *;",
      question
    );
  }

  async getOrCreateSourceFromName(name: string): Promise<Source> {
    return this.db.one(
      "INSERT INTO bezos.sources (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = bezos.sources.name RETURNING *",
      name
    );
  }

  async addRound(name: string, description: string): Promise<Round> {
    return this.db.one(
      "INSERT INTO bezos.rounds (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
  }

  async scheduleRoundQuestion(
    roundQuestion: RoundQuestion
  ): Promise<InsertedRoundQuestion> {
    return this.db.one(
      "INSERT INTO bezos.rounds_questions (question_id, round_id, active) VALUES (${questionId}, ${roundId}, FALSE) RETURNING *",
      roundQuestion
    );
  }

  async getInactiveRoundQuestion(round: Round): Promise<InsertedRoundQuestion> {
    return this.db.one(
      "SELECT * FROM bezos.rounds_questions WHERE round_id = ${id} AND active = FALSE LIMIT 1",
      round
    );
  }
}
