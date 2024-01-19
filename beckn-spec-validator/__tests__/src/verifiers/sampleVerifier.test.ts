import { verifySample } from "../../../src/verifiers/sampleVerifier";
import * as fs from "fs";

test("with valid sample", async () => {
  const yamlSpec = fs.readFileSync("__tests__/fixtures/derived.yaml", "utf-8");
  const sampleJSON = fs.readFileSync("__tests__/fixtures/good_sample.json", "utf-8");
  const result = await verifySample(yamlSpec, sampleJSON, "components.schemas.Car");
  expect(result).toEqual(true);
});

test("with invalid sample", async () => {
  const yamlSpec = fs.readFileSync("__tests__/fixtures/derived.yaml", "utf-8");
  const sampleJSON = fs.readFileSync("__tests__/fixtures/bad_sample.json", "utf-8");
  await expect(verifySample(yamlSpec, sampleJSON, "components.schemas.Car")).rejects.toThrow();
});
