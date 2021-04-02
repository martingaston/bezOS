import "./config";
import { db } from "./db";

(async () => {
  const source = await db.questions.getOrCreateSourceFromName("Amazon");
  const question = await db.questions.addNewQuestion({
    text: "Testing From Node",
    type: "MULTIPLE_CHOICE",
    options: { A: "Test", B: 1234, C: true },
    answer: "A",
    source: source.id,
  });

  console.log(question);
})();
