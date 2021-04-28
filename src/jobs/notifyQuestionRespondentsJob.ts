import { notifyRespondent } from "../slack/notifyRespondent";
import { getRespondentsToQuestionsThatNeedNotifying } from "../quiz/getRespondentsThatNeedNotifying";

export const notifyQuestionRespondentsJob = async (): Promise<void> => {
  const respondentsToNotify = await getRespondentsToQuestionsThatNeedNotifying();

  respondentsToNotify.map(notifyRespondent);
};
