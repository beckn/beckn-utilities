import * as jsonlint from "jsonlint";

export function verifyJSON(content: string, filename = "", verbose = false): boolean {
  if (verbose) console.log(`Verifying ${filename} for json correctness`);

  jsonlint.parse(content);

  if (verbose) console.log("ok");
  return true;
}
