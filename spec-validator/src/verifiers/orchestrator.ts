import { ValidationArguments } from "../helpers/validationArguments";
import { verifyYAML } from "./yamlVerifier";
import * as fs from "fs";

export function perform(options: ValidationArguments) {
  if (options.baseSpec && !options.derivedSpec && !options.sampleJSON) {
    onlyYAMLValidation(options.baseSpec);
  } else if (options.baseSpec && options.derivedSpec) {
    derivedSpecValidation(options.baseSpec, options.derivedSpec);
  } else if (options.baseSpec && options.sampleJSON) {
    sampleValidation(options.baseSpec, options.sampleJSON);
  } else if (options.sampleJSON) {
    onlyJSONValidation(options.sampleJSON);
  } else {
    console.log("Hmm. This seems to be a new use case. Please report the text below to the tool authors");
    console.log(options);
  }
}

function onlyYAMLValidation(baseSpec: string[]) {
  for (const specFile of baseSpec) {
    const yamlContent = fs.readFileSync(specFile, "utf-8");
    verifyYAML("");
  }
}

function derivedSpecValidation(baseSpec: string[], derivedSpec: string[]) {
  console.log("ok");
}

function sampleValidation(baseSpec: string[], sampleJSON: string[]) {
  console.log("ok");
}

function onlyJSONValidation(sampleJSON: string[]) {
  console.log("ok");
}
