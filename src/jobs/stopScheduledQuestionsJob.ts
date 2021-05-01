import { stopScheduledQuestions } from "../quiz/stopScheduledQuestions";
import { closeQuestion } from "../slack/closeQuestion";

export const stopScheduledQuestionsJob = async (time: Date): Promise<void> => {
  try {
    const stopped = await stopScheduledQuestions(time);
    stopped.forEach(closeQuestion);
  } catch (e) {
    console.log(`error trying to deactive old questions: ${e}`);
  }
};
