/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "axios";
import { index, safeCreate } from "./actions";
import { PrimaryKey } from "./types";

export async function createObjects(client: AxiosInstance, resourcesName: string, objects: any[], pks: PrimaryKey[]) {
  let was = 0;
  let now = 0;

  const oldObjs = await index(client, resourcesName);
  if (oldObjs) was = oldObjs.length;
  console.log(`Index action for ${resourcesName} returned ${was} objects`);

  for (const obj of objects) {
    await safeCreate(client, resourcesName, obj, pks, oldObjs ? oldObjs : []);
  }

  const newObjs = await index(client, resourcesName);
  if (newObjs) now = newObjs.length;

  console.log(`Created ${now - was} ${resourcesName}. Was:${was} Now:${now}`);
  return newObjs?.reduce((acc, tObj) => {
    try {
      const keys = [];
      for (const pk of pks) {
        if (pk.relation) {
          keys.push(tObj.attributes[pk.key].data?.id);
        } else {
          keys.push(tObj.attributes[pk.key]);
        }
      }
      const tKey = keys.join(":::");
      acc[tKey] = tObj.id;
      return acc;
    } catch (err) {
      console.log(err);
      console.log(JSON.stringify(tObj));
      return acc;
    }
  }, {});
}
