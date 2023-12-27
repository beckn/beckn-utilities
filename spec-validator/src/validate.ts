import { getValidationArguments, ValidationArguments } from "./helpers/validationArguments";
import * as orchestrator from "./verifiers/orchestrator";

export async function validate(options: ValidationArguments) {
  if (options.verbose) console.log("Start validation");
  const result = await orchestrator.perform(options);
  if (result) {
    if (options.verbose) console.log("Validation successful");
  } else {
    if (options.verbose) console.log("Validation failed");
  }
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  validate(getValidationArguments());
}
