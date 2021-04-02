import "./config";
import { db } from "./db";
import seedFile from "../seeds/aws-saa-c02-sample-exam-questions.json";
import { QuestionType } from "./db/repositories/questions";

(async () => {
  db.tx(async (t) => {
    const source = await t.questions.getOrCreateSourceFromName(seedFile.source);
    const toInsert = seedFile.questions.map(
      async ({ answer, options, text, type }) => {
        return await t.questions.addNewQuestion({
          text,
          type: parseType(type),
          options,
          answer,
          source: source.id,
        });
      }
    );

    await Promise.all(toInsert);
  }).catch((e) => console.log(e));
})();

const parseType = (type: string): QuestionType => {
  if (type === "MULTIPLE_CHOICE" || type === "MULTIPLE_RESPONSE") {
    return type;
  }

  throw new Error("type must be MULTIPLE_CHOICE or MULTIPLE_RESPONSE");
};
