import Ajv from "ajv";
import * as yaml from "yaml";

export function verifySample(
  yamlSpec: string,
  jsonContent: string,
  componentName: string,
  yamlFN = "",
  jsonFN = "",
  verbose = false
) {
  const schema = yaml.parse(yamlSpec);
  const data = JSON.parse(jsonContent);
  const ajv = new Ajv();
  for (const key in schema["components"]["schemas"]) {
    const id = `#/components/schemas/${key}`;
    ajv.addSchema({ $id: id, ...schema["components"]["schemas"][key] });
  }
  ajv.addKeyword("discriminator");
  const validate = ajv.compile(schema["components"]["schemas"][componentName]);
  const valid = validate(data);
  if (valid) {
    return true;
  }
  throw new Error(JSON.stringify(validate.errors, null, 2));
}
