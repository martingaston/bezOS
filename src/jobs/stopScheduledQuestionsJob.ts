import { stopScheduledQuestions } from "../quiz/stopScheduledQuestions";
import { closeQuestion } from "../slack/closeQuestion";

export const stopScheduledQuestionsJob = async (time: Date): Promise<void> => {
  const stopped = await stopScheduledQuestions(time);

  stopped.forEach(closeQuestion);
};
