import { perform } from "../../../src/verifiers/orchestrator";
import * as yamlVerifier from "../../../src/verifiers/yamlVerifier";
import * as jsonVerifier from "../../../src/verifiers/jsonVerifier";
import * as specVerifier from "../../../src/verifiers/specVerifier";
import * as sampleVerifier from "../../../src/verifiers/sampleVerifier";

let verifyYAML: any;
let verifyJSON: any;
let verifySpec: any;
let verifySample: any;

beforeEach(() => {
  verifyYAML = jest.spyOn(yamlVerifier, "verifyYAML");
  verifyJSON = jest.spyOn(jsonVerifier, "verifyJSON");
  verifySpec = jest.spyOn(specVerifier, "verifySpec");
  verifySample = jest.spyOn(sampleVerifier, "verifySample");
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("only yaml verification", () => {
  test("calls the yaml verifier", async () => {
    await perform({ baseSpec: ["__tests__/fixtures/base.yaml"] });
    expect(verifyYAML).toHaveBeenCalledTimes(1);
    expect(verifyJSON).not.toHaveBeenCalled();
    expect(verifySpec).not.toHaveBeenCalled();
    expect(verifySample).not.toHaveBeenCalled();
  });
  test("with multiple files, calls once for each file", async () => {
    await perform({ baseSpec: ["__tests__/fixtures/base.yaml", "__tests__/fixtures/derived.yaml"] });
    expect(verifyYAML).toHaveBeenCalledTimes(2);
    expect(verifyJSON).not.toHaveBeenCalled();
    expect(verifySpec).not.toHaveBeenCalled();
    expect(verifySample).not.toHaveBeenCalled();
  });
});

describe("only json verification", () => {
  test("calls the json verifier", async () => {
    await perform({ sampleJSON: ["__tests__/fixtures/good_sample.json"] });
    expect(verifyYAML).not.toHaveBeenCalled();
    expect(verifyJSON).toHaveBeenCalledTimes(1);
    expect(verifySpec).not.toHaveBeenCalled();
    expect(verifySample).not.toHaveBeenCalled();
  });

  test("with multiple files, calls once for each file", async () => {
    await perform({ sampleJSON: ["__tests__/fixtures/good_sample.json", "__tests__/fixtures/good_sample.json"] });
    expect(verifyYAML).not.toHaveBeenCalled();
    expect(verifyJSON).toHaveBeenCalledTimes(2);
    expect(verifySpec).not.toHaveBeenCalled();
    expect(verifySample).not.toHaveBeenCalled();
  });
});

describe("spec verification", () => {
  test("calls the yaml verifier and spec verifier", async () => {
    await perform({ baseSpec: ["__tests__/fixtures/base.yaml"], derivedSpec: ["__tests__/fixtures/derived.yaml"] });
    expect(verifyYAML).toHaveBeenCalledTimes(2);
    expect(verifyJSON).not.toHaveBeenCalled();
    expect(verifySpec).toHaveBeenCalledTimes(1);
    expect(verifySample).not.toHaveBeenCalled();
  });
});

describe("sample verification", () => {
  test("calls the yaml verifier, json verifier and sample verifier", async () => {
    await perform({
      baseSpec: ["__tests__/fixtures/derived.yaml"],
      sampleJSON: ["__tests__/fixtures/good_sample.json"],
      componentPath: "Components.Schemas.Car",
    });
    expect(verifyYAML).toHaveBeenCalledTimes(1);
    expect(verifyJSON).toHaveBeenCalledTimes(1);
    expect(verifySpec).not.toHaveBeenCalled();
    expect(verifySample).toHaveBeenCalledTimes(1);
  });
});
