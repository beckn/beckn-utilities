import axios from "axios";

export function axios_client() {
  return axios.create({
    baseURL: process.env.STRAPI_API_SERVER,
    headers: {
      common: {
        Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
      },
    },
  });
}
