import { getValidationArguments, exportedForTesting } from "../../../src/helpers/validationArguments";

test("without arguments", () => {
  const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("Mock");
  });
  expect(() => {
    getValidationArguments();
  }).toThrow();
  expect(exitSpy).toHaveBeenCalled();
  exitSpy.mockRestore();
});

test("for invalid arguments", () => {
  const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("Mock");
  });
  const kosherArgumentsSpy = jest.spyOn(exportedForTesting, "kosherArguments").mockImplementation(() => false);
  expect(() => {
    getValidationArguments();
  }).toThrow();
  expect(exitSpy).toHaveBeenCalled();
  exitSpy.mockRestore();
});

describe("kosherArguments", () => {
  const { kosherArguments } = exportedForTesting;

  test("with no value for argument type", () => {
    expect(kosherArguments({ baseSpec: [] })).toEqual(false);
  });

  test("with only derived spec value", () => {
    expect(kosherArguments({ derivedSpec: ["def"] })).toEqual(false);
  });

  test("with base, derived and sample", () => {
    expect(
      kosherArguments({
        baseSpec: ["abc"],
        derivedSpec: ["def"],
        sampleJSON: ["ghi"],
      })
    ).toEqual(false);
  });

  test("for only yaml check", () => {
    expect(kosherArguments({ baseSpec: ["def"] })).toEqual(true);
  });

  test("for only json check", () => {
    expect(kosherArguments({ sampleJSON: ["def"] })).toEqual(true);
  });

  test("for yaml-yaml check", () => {
    expect(kosherArguments({ baseSpec: ["def"], derivedSpec: ["ghi"] })).toEqual(true);
  });

  test("for yaml-json check", () => {
    expect(kosherArguments({ baseSpec: ["def"], sampleJSON: ["ghi"] })).toEqual(true);
  });
});
