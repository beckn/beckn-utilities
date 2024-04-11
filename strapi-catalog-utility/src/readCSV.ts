import csv from "csvtojson";

export async function read_csv_file(filename: string) {
  const records = await csv().fromFile(filename);
  return records;
}
