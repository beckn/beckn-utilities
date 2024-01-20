import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as yaml from "yaml";
import $RefParser from "@apidevtools/json-schema-ref-parser";

export async function verifySample(
  yamlSpec: string,
  jsonContent: string,
  componentPath: string,
  yamlFN = "",
  jsonFN = "",
  verbose = false
) {
  if (verbose) console.log(`Verifying ${jsonFN} against ${yamlFN}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const schema: any = yaml.parse(yamlSpec);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: any = JSON.parse(jsonContent);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const derefSchema: any = await $RefParser.dereference(schema);
  const ajv = new Ajv({ formats: { phone: true } });
  addFormats(ajv);
  ajv.addKeyword("discriminator");
  const validate = ajv.compile(fetchByDotOperator(derefSchema, componentPath));
  const valid = validate(data);
  if (valid) {
    if (verbose) console.log("ok");
    return true;
  }
  throw new Error(JSON.stringify(validate.errors, null, 2));
}

function fetchByDotOperator(object: any, value: string): any {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return value.split(".").reduce((acc, curr) => acc[curr], object);
}
