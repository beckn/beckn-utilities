import { verifyYAML } from "../../../src/verifiers/yamlVerifier";
import * as fs from "fs";

test("With valid yaml content", async () => {
  const yaml_content = fs.readFileSync("__tests__/fixtures/base.yaml", "utf-8");
  const result = await verifyYAML(yaml_content);
  expect(result).toEqual(true);
});

test("With bad yaml content", async () => {
  const yaml_content = fs.readFileSync("__tests__/fixtures/bad_yaml.yaml", "utf-8");
  await expect(verifyYAML(yaml_content)).rejects.toThrow();
});
