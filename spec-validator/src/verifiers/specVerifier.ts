import OpenApiDiff from "openapi-diff";
import OpenAPIErrorBuilder from "./openAPIErrorBuilder";

export async function verifySpec(baseYAMLContent: string, derivedYAMLContent: string): Promise<boolean> {
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
  console.log(result);
  // console.log();
  if (result.breakingDifferencesFound) {
    throw new Error(new OpenAPIErrorBuilder(result).breakingErrors().join("----------\n"));
  }
  return true;
}
