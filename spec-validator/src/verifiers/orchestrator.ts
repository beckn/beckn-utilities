import { ValidationArguments } from "../helpers/validationArguments";
import { verifyJSON } from "./jsonVerifier";
import { verifySample } from "./sampleVerifier";
import { verifySpec } from "./specVerifier";
import { verifyYAML } from "./yamlVerifier";
import * as fs from "fs";

export async function perform(options: ValidationArguments) {
  try {
    if (options.baseSpec && !options.derivedSpec && !options.sampleJSON) {
      onlyYAMLValidation(options.baseSpec, options.verbose);
    } else if (options.baseSpec && options.derivedSpec) {
      await derivedSpecValidation(options.baseSpec, options.derivedSpec, options.verbose);
    } else if (options.baseSpec && options.sampleJSON && options.componentName) {
      sampleValidation(options.baseSpec, options.sampleJSON, options.componentName, options.verbose);
    } else if (options.sampleJSON) {
      onlyJSONValidation(options.sampleJSON, options.verbose);
    } else {
      console.log("Hmm. This seems to be a new use case. Please report the text below to the tool authors");
      console.log(options);
      process.exit(0);
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      throw error;
    }
    return false;
  }
}

function onlyYAMLValidation(baseSpec: string[], verbose = false) {
  for (const specFile of baseSpec) {
    const yamlContent = fs.readFileSync(specFile, "utf-8");
    verifyYAML(yamlContent, specFile, verbose);
  }
}

async function derivedSpecValidation(baseSpec: string[], derivedSpec: string[], verbose = false) {
  for (const baseFile of baseSpec) {
    const baseYAML = fs.readFileSync(baseFile, "utf-8");
    verifyYAML(baseYAML, baseFile, verbose);
    for (const derivedFile of derivedSpec) {
      const derivedYAML = fs.readFileSync(derivedFile, "utf-8");
      verifyYAML(derivedYAML, derivedFile, verbose);
      await verifySpec(baseYAML, derivedYAML, baseFile, derivedFile, verbose);
    }
  }
}

function onlyJSONValidation(sampleJSON: string[], verbose = false) {
  for (const jsonFile of sampleJSON) {
    const jsonContent = fs.readFileSync(jsonFile, "utf-8");
    verifyJSON(jsonContent, jsonFile, verbose);
  }
}

function sampleValidation(baseSpec: string[], sampleJSON: string[], componentName: string, verbose = false) {
  for (const baseFile of baseSpec) {
    const baseYAML = fs.readFileSync(baseFile, "utf-8");
    verifyYAML(baseYAML, baseFile, verbose);
    for (const jsonFile of sampleJSON) {
      const jsonContent = fs.readFileSync(jsonFile, "utf-8");
      verifyJSON(jsonContent, jsonFile, verbose);
      verifySample(baseYAML, jsonContent, componentName, baseFile, jsonFile, verbose);
    }
  }
}
