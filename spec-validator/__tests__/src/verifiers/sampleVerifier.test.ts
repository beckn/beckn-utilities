import { verifySample } from "../../../src/verifiers/sampleVerifier";
import * as fs from "fs";

test("with valid sample", () => {
  const yamlSpec = fs.readFileSync("__tests__/fixtures/derived.yaml", "utf-8");
  const sampleJSON = fs.readFileSync("__tests__/fixtures/good_sample.json", "utf-8");
  const result = verifySample(yamlSpec, sampleJSON, "Car");
  expect(result).toEqual(true);
});

test("with invalid sample", () => {
  const yamlSpec = fs.readFileSync("__tests__/fixtures/derived.yaml", "utf-8");
  const sampleJSON = fs.readFileSync("__tests__/fixtures/bad_sample.json", "utf-8");
  expect(() => verifySample(yamlSpec, sampleJSON, "Car")).toThrow();
});
