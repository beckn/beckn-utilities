import YAML from "yaml";

export function verifyYAML(content: string, filename = "", verbose = false): boolean {
  if (verbose) console.log(`Verifying ${filename} for yaml correctness`);
  const yaml_content = YAML.parse(content, { prettyErrors: true });
  if (verbose) console.log("ok");
  return true;
}
