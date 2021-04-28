import { db } from "../db";

export type QuestionRespondentNotification = {
  correct: boolean;
  respondent: {
    userId: string;
    slackId: string;
  };
};

export const getRespondentsToQuestionsThatNeedNotifying = async (): Promise<
  QuestionRespondentNotification[]
> => {
  const questionsToNotify = await db.questions.getUnnotifiedRoundsQuestionsNotifications();
  const notifications = questionsToNotify.map(async (notification) => {
    const answered = await db.answers.findAnswersByRoundQuestionId(
      notification.roundsQuestionsId
    );

    const roundQuestion = await db.questions.getRoundQuestionById(
      notification.roundsQuestionsId
    );

    const question = await db.questions.getQuestionById(
      roundQuestion.questionId
    );

    db.questions.setRoundQuestionNotificationToNotifiedById(notification.id);

    return Promise.all(
      answered.map(async (answer) => {
        const user = await db.users.getUserById(answer.userId);
        return {
          correct: compareAnswers(question.answer.value, answer.answer),
          respondent: {
            userId: user.userId,
            slackId: user.slackId,
          },
        };
      })
    );
  });

  const result = await Promise.all(notifications);
  return result.reduce((acc, val) => acc.concat(val), []);
};

const compareAnswers = (a: string[], b: string[]): boolean => {
  return (
    a.map((value, index) => value === b[index]).filter((x) => x === false)
      .length === 0
  );
};
