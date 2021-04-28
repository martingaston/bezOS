import { Question } from "./types";
import { db } from "../db";

export const poseQuestion = async (
  startTime: Date,
  endTime: Date
): Promise<Question> => {
  try {
    const question = await activateQuestion(startTime, endTime);
    return Promise.resolve(question);
  } catch (e) {
    return Promise.reject(new Error(`Error posing a new question: ${e}`));
  }
};

const activateQuestion = async (
  startTime: Date,
  endTime: Date
): Promise<Question> => {
  const activeRoundQuestion = await db.questions.activateRoundQuestion(
    startTime,
    endTime
  );

  const question = await db.questions.getQuestionById(
    activeRoundQuestion.questionId
  );

  const source = await db.questions.getSource(question.source);
  const round = await db.questions.getRound(activeRoundQuestion.roundId);

  // this is where you would implement io-ts
  const domainQuestion: Question = {
    id: activeRoundQuestion.id,
    startDate: activeRoundQuestion.startDate,
    endDate: activeRoundQuestion.endDate,
    active: activeRoundQuestion.active,
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
  };

  return domainQuestion;
};
