import { getEnv } from "./getEnv";

// no clashing, thanks
const TEST_ENV = "TESTING_GETENV_BEZOS_77426974-a602-4184-9966-500d0f38e513";

describe("getEnv", () => {
  beforeEach(() => {
    process.env[TEST_ENV] = "two pizzas";
  });

  it("can retrieve an existing environment variable", () => {
    const result = getEnv(TEST_ENV);

    expect(result).toBe("two pizzas");
  });

  it("will error if an environment variable does not exist", () => {
    delete process.env[TEST_ENV];

    expect(() => getEnv(TEST_ENV)).toThrow(Error);
  });
});
