import { perform } from "../../../src/verifiers/orchestrator";

describe("only yaml verification", () => {
  test.only("calls the yaml verifier", () => {
    perform({ baseSpec: ["__tests__/fixtures/base.yaml"] });
  });
});
