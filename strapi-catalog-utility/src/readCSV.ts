import csv from "csvtojson";

export async function readCSVFile(filename: string) {
  const records = await csv().fromFile(filename);
  return records;
}
