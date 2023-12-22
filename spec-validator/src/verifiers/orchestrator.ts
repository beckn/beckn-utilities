import { ValidationArguments } from "../helpers/validationArguments";
import { verifyJSON } from "./jsonVerifier";
import { verifySample } from "./sampleVerifier";
import { verifySpec } from "./specVerifier";
import { verifyYAML } from "./yamlVerifier";
import * as fs from "fs";

export function perform(options: ValidationArguments) {
  if (options.baseSpec && !options.derivedSpec && !options.sampleJSON) {
    onlyYAMLValidation(options.baseSpec);
  } else if (options.baseSpec && options.derivedSpec) {
    derivedSpecValidation(options.baseSpec, options.derivedSpec);
  } else if (options.baseSpec && options.sampleJSON && options.componentName) {
    sampleValidation(options.baseSpec, options.sampleJSON, options.componentName);
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
    verifyYAML(yamlContent);
  }
}

function derivedSpecValidation(baseSpec: string[], derivedSpec: string[]) {
  for (const baseFile of baseSpec) {
    const baseYAML = fs.readFileSync(baseFile, "utf-8");
    verifyYAML(baseYAML);
    for (const derivedFile of derivedSpec) {
      const derivedYAML = fs.readFileSync(derivedFile, "utf-8");
      verifyYAML(derivedYAML);
      verifySpec(baseYAML, derivedYAML);
    }
  }
}

function onlyJSONValidation(sampleJSON: string[]) {
  for (const jsonFile of sampleJSON) {
    const jsonContent = fs.readFileSync(jsonFile, "utf-8");
    verifyJSON(jsonContent);
  }
}

function sampleValidation(baseSpec: string[], sampleJSON: string[], componentName: string) {
  for (const baseFile of baseSpec) {
    const baseYAML = fs.readFileSync(baseFile, "utf-8");
    verifyYAML(baseYAML);
    for (const jsonFile of sampleJSON) {
      const jsonContent = fs.readFileSync(jsonFile, "utf-8");
      verifyJSON(jsonContent);
      verifySample(baseYAML, jsonContent, componentName);
    }
  }
}
