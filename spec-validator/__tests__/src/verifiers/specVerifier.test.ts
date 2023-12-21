import { verifySpec } from "../../../src/verifiers/specVerifier";
import * as fs from "fs";

test("With same file as both base and derived", async () => {
  const base_content = fs.readFileSync("__tests__/fixtures/base.yaml", "utf-8");
  const derived_content = fs.readFileSync("__tests__/fixtures/base.yaml", "utf-8");
  const result = await verifySpec(base_content, derived_content);
  expect(result).toEqual(true);
});

test("With valid derived file", async () => {
  const base_content = fs.readFileSync("__tests__/fixtures/base.yaml", "utf-8");
  const derived_content = fs.readFileSync("__tests__/fixtures/derived.yaml", "utf-8");
  const result = await verifySpec(base_content, derived_content);
  expect(result).toEqual(true);
});

test("With invalid derived file", async () => {
  const base_content = fs.readFileSync("__tests__/fixtures/base.yaml", "utf-8");
  const derived_content = fs.readFileSync("__tests__/fixtures/bad_derived.yaml", "utf-8");
  await expect(verifySpec(base_content, derived_content)).rejects.toThrow();
  // const result = await verifySpec(base_content, derived_content);
  // expect(result).toEqual(false);
});
