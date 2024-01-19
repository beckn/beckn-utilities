import { verifyJSON } from "../../../src/verifiers/jsonVerifier";
import * as fs from "fs";

test("With valid json content", () => {
  const content = fs.readFileSync("__tests__/fixtures/good_sample.json", "utf-8");
  expect(verifyJSON(content)).toEqual(true);
});

test("With bad json content", () => {
  const content = fs.readFileSync("__tests__/fixtures/bad_json.json", "utf-8");
  expect(() => verifyJSON(content)).toThrow();
});
