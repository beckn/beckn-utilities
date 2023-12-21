import YAML from "yaml";

export function verifyYAML(content: string): boolean {
  const yaml_content = YAML.parse(content, { prettyErrors: true });
  return true;
}
