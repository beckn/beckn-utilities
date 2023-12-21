import { getValidationArguments, ValidationArguments } from "./helpers/validationArguments";
import * as orchestrator from "./verifiers/orchestrator";

export function validate(options: ValidationArguments) {
  console.log("Start validation");
  orchestrator.perform(options);
  console.log("Validation successful");
}

if (require.main === module) {
  validate(getValidationArguments());
}
