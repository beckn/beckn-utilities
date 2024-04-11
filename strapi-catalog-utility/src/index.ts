/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { axios_client } from "./client";
import { read_csv_file } from "./readCSV";
import {
  getItemFulfillments,
  get_cat_attr_tag_relations,
  get_sc_products,
  get_unique_categories,
  get_unique_domains,
  get_unique_fulfillments,
  get_unique_items,
  get_unique_locations,
  get_unique_media,
  get_unique_providers,
  get_unique_tags,
  print_duplicates,
} from "./recordCreator";
import { createObjects } from "./dbWriter";

async function main() {
  dotenv.config();
  const client = axios_client();

  const records = await read_csv_file("samples/items.csv");

  // print_duplicates(records);

  const domains = get_unique_domains(records);
  console.log(`Domains: ${domains.length}`);
  const domainsMap = await createObjects(client, "Domains", domains, [{ key: "DomainName", relation: false }]);

  const locations = get_unique_locations(records);
  console.log(`Locations: ${locations.length}`);
  const locationsMap = await createObjects(client, "Locations", locations, [{ key: "gps", relation: false }]);

  const media = get_unique_media(records);
  console.log(`Images: ${media.length}`);
  const mediaMap = await createObjects(client, "Medias", media, [{ key: "url", relation: false }]);

  const categories = get_unique_categories(records);
  console.log(`Categories: ${categories.length}`);
  const categoriesMap = await createObjects(client, "Categories", categories, [{ key: "value", relation: false }]);

  const tags = get_unique_tags(records);
  console.log(`Tags: ${tags.length}`);
  const tagsMap = await createObjects(client, "Tags", tags, [{ key: "tag_name", relation: false }]);

  const fulfillments = get_unique_fulfillments(records);
  console.log(`Fulfillments: ${fulfillments.length}`);
  const fulfillmentMaps = await createObjects(client, "fulfilments", fulfillments, [{ key: "type", relation: false }]);

  const providers = get_unique_providers(records, domainsMap, locationsMap, mediaMap);
  console.log(`Providers: ${providers.length}`);
  const providersMap = await createObjects(client, "Providers", providers, [
    { key: "provider_name", relation: false },
    { key: "location_id", relation: true },
  ]);

  const items = get_unique_items(records, mediaMap, providersMap, locationsMap);
  console.log(`Items: ${items.length}`);
  const itemsMap = await createObjects(client, "Items", items, [
    { key: "name", relation: false },
    { key: "provider", relation: true },
  ]);

  const sc_products = get_sc_products(records, itemsMap, providersMap, locationsMap);
  console.log(`sc-products: ${sc_products.length}`);
  const sc_productsMap = await createObjects(client, "sc-products", sc_products, [
    { key: "sku", relation: false },
    { key: "item_id", relation: true },
  ]);

  const cat_attr_tag_relations = get_cat_attr_tag_relations(
    records,
    categoriesMap,
    tagsMap,
    itemsMap,
    providersMap,
    locationsMap
  );
  console.log(`cat_attr_tag_relations: ${cat_attr_tag_relations.length}`);
  const catAttrTagRelationsMap = await createObjects(client, "cat-attr-tag-relations", cat_attr_tag_relations, [
    { key: "taxanomy", relation: false },
    { key: "taxanomy_id", relation: false },
    { key: "item", relation: true },
    { key: "provider", relation: true },
  ]);

  const itemFulfillments = getItemFulfillments(records, fulfillmentMaps, itemsMap, providersMap, locationsMap);
  console.log(`itemFulfillments: ${itemFulfillments.length}`);
  const itemFulfillmentsMap = await createObjects(client, "item-fulfillments", itemFulfillments, [
    { key: "item_id", relation: true },
    { key: "fulfilment_id", relation: true },
  ]);
}

main();
