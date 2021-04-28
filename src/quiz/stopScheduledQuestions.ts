import { Question } from "./types";
import { db } from "../db";
import { InsertedRoundQuestion } from "../db/types";

export type ExpiredQuestion = Question & {
  slackChannel: string;
  slackTs: string;
};

export const stopScheduledQuestions = async (
  date: Date
): Promise<ExpiredQuestion[]> => {
  const stopped = await db.questions.deactivateRoundQuestionsOlderThanDate(
    date
  );

  if (stopped.length === 0) {
    return [];
  }

  return Promise.all(stopped.map(processInactiveQuestion));
};

const processInactiveQuestion = async (
  stoppedQuestion: InsertedRoundQuestion
): Promise<ExpiredQuestion> => {
  db.questions.addRoundQuestionNotificationByRoundQuestionId(
    stoppedQuestion.id
  );

  const question = await db.questions.getQuestionById(
    stoppedQuestion.questionId
  );

  const source = await db.questions.getSource(question.source);
  const round = await db.questions.getRound(stoppedQuestion.roundId);

  const notification = await db.questions.getRoundQuestionSlackNotificationByRoundQuestionId(
    stoppedQuestion.id
  );

  // this is where you would implement io-ts
  const domainQuestion: ExpiredQuestion = {
    id: stoppedQuestion.id,
    startDate: stoppedQuestion.startDate,
    endDate: stoppedQuestion.endDate,
    active: stoppedQuestion.active,
    details: {
      text: question.text,
      type: question.type,
      options: question.options,
      answer: question.answer,
    },
    round: {
      name: round.name,
      description: round.description,
    },
    source: source.name,
    slackTs: notification.slackTs,
    slackChannel: notification.slackChannel,
  };

  return domainQuestion;
};
