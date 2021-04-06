import "./config";
import { db, Tx } from "./db/pg";
import seedFile from "../seeds/aws-saa-c02-sample-exam-questions.json";
import { InsertedQuestion, QuestionType } from "./db/types";

type SeedQuestionJson = {
  source: string;
  exam: string;
  questions: {
    id: number;
    text: string;
    type: string;
    options: {
      name: string;
      text: string;
    }[];
    answer: {
      value: string[];
      text: string;
    };
  }[];
};

const createSeed = (db: Tx) => {
  return new Seed(db);
};

class Seed {
  private db: Tx;

  constructor(db: Tx) {
    this.db = db;
  }

  public async getOrCreateSource(source: string) {
    return await this.db.questions.getOrCreateSourceFromName(source);
  }

  public async insertQuestions(
    questions: SeedQuestionJson["questions"],
    sourceId: string
  ) {
    const toInsert = questions.map(async ({ answer, options, text, type }) => {
      return await this.db.questions.addNewQuestion({
        text,
        type: await parseType(type),
        options,
        answer,
        source: sourceId,
      });
    });

    return await Promise.all(toInsert);
  }

  public async createRound(exam: string, source: string) {
    const name = `${exam} | ${source}`;
    const description = `Seeded from JSON on ${new Date().toISOString()}`;

    return await this.db.questions.addRound(name, description);
  }

  public async scheduleQuestions(
    questions: InsertedQuestion[],
    roundId: number
  ) {
    const toSchedule = questions.map(async (question) => {
      return await this.db.questions.scheduleRoundQuestion({
        questionId: question.id,
        roundId: roundId,
        startDate: new Date(),
        endDate: new Date(),
        active: false,
      });
    });

    return await Promise.all(toSchedule);
  }
}

(async () => {
  db.tx(async (t) => {
    const seed = createSeed(t);

    const source = await seed.getOrCreateSource(seedFile.source);
    const questions = await seed.insertQuestions(seedFile.questions, source.id);
    const round = await seed.createRound(seedFile.exam, seedFile.source);

    const seeded = await seed.scheduleQuestions(questions, round.id);
    console.log(seeded);
  }).catch((e) => console.log(e));
})();

const parseType = async (type: string): Promise<QuestionType> => {
  if (type === "MULTIPLE_CHOICE" || type === "MULTIPLE_RESPONSE") {
    return type;
  }

  return Promise.reject("type must be MULTIPLE_CHOICE or MULTIPLE_RESPONSE");
};
