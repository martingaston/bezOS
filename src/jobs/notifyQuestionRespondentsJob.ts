import { notifyRespondent } from "../slack/notifyRespondent";
import { getRespondentsToQuestionsThatNeedNotifying } from "../quiz/getRespondentsThatNeedNotifying";

export const notifyQuestionRespondentsJob = async (): Promise<void> => {
  try {
    const respondentsToNotify = await getRespondentsToQuestionsThatNeedNotifying();
    respondentsToNotify.map(notifyRespondent);
  } catch (e) {
    console.log(`error trying to notify respondents... ${e}`);
  }
};
