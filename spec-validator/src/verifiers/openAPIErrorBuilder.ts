import OpenApiDiff from "openapi-diff";
import { diff, diffString } from "json-diff";

export default class OpenAPIErrorBuilder {
  constructor(public results: OpenApiDiff.DiffOutcome) {}
  breakingErrors() {
    if (!this.results.breakingDifferencesFound) return [];
    return this.results.breakingDifferences.map((x) => this.formatError(x));
  }

  formatError(error: any) {
    try {
      const instances = [];
      for (let i = 0; i < error["sourceSpecEntityDetails"].length; i++) {
        if (!error["destinationSpecEntityDetails"]) break;
        instances.push({
          sourceLocation: error["sourceSpecEntityDetails"][i]["location"],
          destinationLocation: error["destinationSpecEntityDetails"][i]["location"],
          diff: diff(error["sourceSpecEntityDetails"][i]["value"], error["destinationSpecEntityDetails"][i]["value"]),
        });
      }
      return instances;
    } catch (e) {
      return error;
    }
  }
}
