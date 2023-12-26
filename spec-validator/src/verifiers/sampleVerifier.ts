import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as yaml from "yaml";
import { openapiSchemaToJsonSchema } from "@openapi-contrib/openapi-schema-to-json-schema";
import OpenAPISchemaValidator from "openapi-schema-validator";
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
  const schema = yaml.parse(yamlSpec);
  const data = JSON.parse(jsonContent);

  let derefSchema: any = await $RefParser.dereference(schema);
  const ajv = new Ajv();
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

function fetchByDotOperator(object: any, value: string) {
  return value.split(".").reduce((acc, curr) => acc[curr], object);
}
