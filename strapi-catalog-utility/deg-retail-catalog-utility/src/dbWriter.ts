/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "axios";
import { index, safeCreate } from "./actions";
import { PrimaryKey } from "./types";

export async function createObjects(
  client: AxiosInstance,
  resourcesName: string,
  objects: any[],
  pks: PrimaryKey[]
) {
  let was = 0;
  let now = 0;

  const oldObjs = await index(client, resourcesName);
  if (oldObjs) was = oldObjs.length;

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
          keys.push(tObj.attributes[pk.key]?.data?.id);
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
      process.exit(1);
      return acc;
    }
  }, {});
}

export const createPriceBreakups = async (
  client: AxiosInstance,
  pricebreakups: any[]
) => {
  for (const priceBreakup of pricebreakups) {
    try {
      const base_price_response = await client.post(`/api/price-bareakups`, {
        data: priceBreakup.price_breakups[0]
      });
      const tax_response = await client.post(`/api/price-bareakups`, {
        data: priceBreakup.price_breakups[1]
      });

      const sc_retail_products_updated = await client.put(
        `/api/sc-products/${priceBreakup.sc_retail_product_id}`,
        {
          data: {
            price_bareakup_ids: [
              base_price_response.data.data.id,
              tax_response.data.data.id
            ]
          }
        }
      );
    } catch (error: any) {
      console.log(
        `error===> for ${JSON.stringify(priceBreakup, null, 2)}`,
        error
      );
      process.exit(1);
    }
  }
};
