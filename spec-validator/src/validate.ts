import { getValidationArguments, ValidationArguments } from "./helpers/validationArguments";
import * as orchestrator from "./verifiers/orchestrator";

export function validate(options: ValidationArguments) {
  if (options.verbose) console.log("Start validation");
  orchestrator.perform(options);
  if (options.verbose) console.log("Validation successful");
}

if (require.main === module) {
  validate(getValidationArguments());
}
