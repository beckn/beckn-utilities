import { verifyYAML } from "../../../src/verifiers/yamlVerifier";
import * as fs from "fs";

test("With valid yaml content", () => {
  const yaml_content = fs.readFileSync("__tests__/fixtures/base.yaml", "utf-8");
  expect(verifyYAML(yaml_content)).toEqual(true);
});

test("With bad yaml content", () => {
  const yaml_content = fs.readFileSync("__tests__/fixtures/bad_yaml.yaml", "utf-8");
  expect(() => verifyYAML(yaml_content)).toThrow();
});
