import OpenApiDiff from "openapi-diff";

export default class OpenAPIErrorBuilder {
  constructor(public results: OpenApiDiff.DiffOutcome) {}
  breakingErrors() {
    if (!this.results.breakingDifferencesFound) return [];
    return this.results.breakingDifferences.map((x) => this.formatError(x));
  }

  formatError(error: any) {
    return `${error.code} Source- ${JSON.stringify(error.sourceSpecEntityDetails[0])}, Dest-${JSON.stringify(
      error.destinationSpecEntityDetails[0]
    )}`;
  }
}
