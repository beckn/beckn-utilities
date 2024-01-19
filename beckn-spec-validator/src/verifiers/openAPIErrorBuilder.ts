import OpenApiDiff from "openapi-diff";
import { DiffResult } from "openapi-diff";
import { diff } from "json-diff";

export default class OpenAPIErrorBuilder {
  constructor(public results: OpenApiDiff.DiffOutcome) {}
  breakingErrors(): any {
    if (!this.results.breakingDifferencesFound) return [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.results.breakingDifferences.map((x) => this.formatError(x));
  }

  formatError(error: DiffResult<"breaking">): any {
    try {
      const instances = [];
      for (let i = 0; i < error["sourceSpecEntityDetails"].length; i++) {
        if (!error["destinationSpecEntityDetails"]) break;
        instances.push({
          sourceLocation: error["sourceSpecEntityDetails"][i]["location"],
          destinationLocation: error["destinationSpecEntityDetails"][i]["location"],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          diff: diff(error["sourceSpecEntityDetails"][i]["value"], error["destinationSpecEntityDetails"][i]["value"]),
        });
      }
      return instances;
    } catch (e) {
      return error;
    }
  }
}
