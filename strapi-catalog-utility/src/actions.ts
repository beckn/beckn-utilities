/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosResponse } from "axios";
import { PrimaryKey } from "./types";

export async function index(client: AxiosInstance, resources: string) {
  try {
    let responseArray: any[] = [];
    let currPage = 0;
    let pageCount = 0;
    do {
      const response: AxiosResponse = await client.get(
        `${getIndexString(resources)}&pagination[page]=${currPage + 1}&pagination[pageSize]=100`
      );
      responseArray = responseArray.concat(response.data.data);
      currPage += 1;
      pageCount = response.data.meta.pagination.pageCount;
    } while (currPage < pageCount);
    return responseArray;
  } catch (err: any) {
    console.log(err.response);
  }
}

export async function safeCreate(
  client: AxiosInstance,
  resources: string,
  data: any,
  pks: PrimaryKey[],
  tObjects: any[]
) {
  try {
    let objects = [];
    if (tObjects) objects = tObjects;
    else objects = (await index(client, resources)) as any[];
    const existingObject = objects?.find((obj) => {
      try {
        let found = true;
        for (const pk of pks) {
          let curr_result = false;
          if (pk.relation) {
            curr_result = obj.attributes[pk.key].data.id === data[pk.key];
          } else {
            curr_result = obj.attributes[pk.key] === data[pk.key];
          }
          found = found && curr_result;
        }
        return found;
      } catch (err: any) {
        console.log(err.message);
        console.log(obj);
        console.log(resources);
      }
    });
    if (!existingObject) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response: AxiosResponse = await client.post(`/api/${resources}`, { data: data });
      // console.log(JSON.stringify(response.data));
    } else {
      // console.log(`Skipping creation of ${resources}:${data[pks[0]]} as it already exists`);
    }
  } catch (err: any) {
    if (err.response && err.response.data && err.response.config) {
      console.log(JSON.stringify(err.response?.data?.error));
      console.log(err.response?.config?.data);
    } else {
      console.log(err.message);
      console.log(pks);
      console.log(data);
    }
  }
}

function getIndexString(resources: string) {
  switch (resources) {
    case "Items":
      return `/api/items?populate[0]=image&populate[1]=provider`;
    case "fulfilments":
      return `/api/fulfilments?`;

    default:
      return `/api/${resources}?populate=*`;
  }
}
