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

    let submittedAnswer;
    let action: Action;
    if (
      answerInDb !== null &&
      compareAnswers(answerInDb.answer, answer.answer)
    ) {
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
        slackId: user.id,
      },
    };
  } catch (e) {
    return Promise.reject(`There was a problem answering the question: ${e}`);
  }
}

const compareAnswers = (a: string[], b: string[]): boolean => {
  return (
    a.map((value, index) => value === b[index]).filter((x) => x === false)
      .length === 0
  );
};
