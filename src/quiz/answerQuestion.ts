import { UserSubmittedAnswer } from "../types";
import { db } from "../db";

type Action = "CREATED" | "UPDATED" | "NOOP";
export type Answer = {
  action: Action;
  id: number;
  questionId: string;
  answer: string[];
  user: {
    userId: string;
    slackId: string;
  };
};

export async function answerQuestion(
  userSubmittedAnswer: UserSubmittedAnswer
): Promise<Answer> {
  try {
    const user = await db.users.getOrAddUserFromSlack(
      userSubmittedAnswer.userId
    );
    const answer = {
      roundQuestionId: userSubmittedAnswer.questionId,
      userId: user.userId,
      answer: userSubmittedAnswer.answer,
    };

    const answerInDb = await db.answers.findAnswerByRoundQuestionIdAndUserIdOrNull(
      answer.roundQuestionId,
      user.userId
    );

    if (answerInDb === null) {
      return Promise.reject("No answer found in the database");
    }

    let submittedAnswer;
    let action: Action;
    if (answerInDb.answer == answer.answer) {
      action = "NOOP";
      submittedAnswer = answerInDb;
    } else if (answerInDb) {
      action = "UPDATED";
      submittedAnswer = await db.answers.updateAnswer(answer);
    } else {
      action = "CREATED";
      submittedAnswer = await db.answers.addAnswer(answer);
    }

    return {
      action,
      id: submittedAnswer.id,
      questionId: submittedAnswer.roundQuestionId,
      answer: submittedAnswer.answer,
      user: {
        userId: user.userId,
        slackId: user.slackId,
      },
    };
  } catch (e) {
    return Promise.reject(`There was a problem answering the question: ${e}`);
  }
}
