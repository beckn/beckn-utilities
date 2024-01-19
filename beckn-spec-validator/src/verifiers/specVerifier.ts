import OpenApiDiff from "openapi-diff";
import OpenAPIErrorBuilder from "./openAPIErrorBuilder";

export async function verifySpec(
  baseYAMLContent: string,
  derivedYAMLContent: string,
  baseYAMLFN = "",
  derivedYAMLFN = "",
  verbose = false
): Promise<boolean> {
  if (verbose) console.log(`Checking if ${derivedYAMLFN} is compliant with ${baseYAMLFN}`);
  const result = await OpenApiDiff.diffSpecs({
    sourceSpec: {
      content: baseYAMLContent,
      location: "__tests__/fixtures/base.yaml",
      format: "openapi3",
    },
    destinationSpec: {
      content: derivedYAMLContent,
      location: "__tests__/fixtures/derived.yaml",
      format: "openapi3",
    },
  });
  if (result.breakingDifferencesFound) {
    throw new Error(JSON.stringify(new OpenAPIErrorBuilder(result).breakingErrors(), null, 2));
  }
  if (verbose) console.log("ok");
  return true;
}
