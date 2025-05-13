/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { axiosClient } from "./client";
import { readCSVFile } from "./readCSV";
import {
  getItemFulfillments,
  getCatAttrTagRelations,
  getUniqueSCRetailProducts,
  getUniqueCategories,
  getUniqueDomains,
  getUniqueFulfillments,
  getUniqueItems,
  getUniqueLocations,
  getUniqueMedia,
  getUniqueProviders,
  getUniqueTags,
  hasDuplicates,
  createPriceBreakupObjects,
  getUniqueCountries,
  getUniqueTagGroups
} from "./recordCreator";
import { createObjects, createPriceBreakups } from "./dbWriter";

async function main(providerFilename: string, itemFilename: string) {
  dotenv.config();
  const client = axiosClient();

  const providerRecords = await readCSVFile(providerFilename);
  const records = await readCSVFile(itemFilename);

  if (hasDuplicates(providerRecords, records)) {
    process.exit(1);
  }

  const countries = getUniqueCountries(providerRecords);
  console.log(`Countries: ${countries.length}`);
  const countriesMap = await createObjects(client, "Countries", countries, [
    { key: "name", relation: false },
    { key: "code", relation: false }
  ]);

  const domains = getUniqueDomains(providerRecords);
  console.log(`Domains: ${domains.length}`);
  const domainsMap = await createObjects(client, "Domains", domains, [
    { key: "DomainName", relation: false }
  ]);
  console.log(
    `Domains: ${domains.length}, ${JSON.stringify(domainsMap, null, 2)}`
  );

  const locations = getUniqueLocations(providerRecords);
  console.log(`Locations: ${locations.length}`);
  const locationsMap = await createObjects(client, "Locations", locations, [
    { key: "gps", relation: false }
  ]);

  const media = getUniqueMedia(records, providerRecords);
  console.log(`Images: ${media.length}`);
  const mediaMap = await createObjects(client, "Medias", media, [
    { key: "url", relation: false }
  ]);

  const categories = getUniqueCategories(records);
  console.log(`Categories: ${categories.length}`);
  const categoriesMap = await createObjects(client, "Categories", categories, [
    { key: "value", relation: false }
  ]);

  const tagGroups = getUniqueTagGroups(records);
  console.log(
    `TagGroups: ${tagGroups.length}, ${JSON.stringify(tagGroups, null, 2)}`
  );
  const tagGroupsMap = await createObjects(client, "tag-groups", tagGroups, [
    { key: "tag_group_name", relation: false }
  ]);

  console.log(JSON.stringify(tagGroupsMap, null, 2));

  const tags = getUniqueTags(records, tagGroupsMap);
  console.log(`Tags: ${tags.length}`);
  console.log("tags======>", JSON.stringify(tags, null, 2));
  const tagsMap = await createObjects(client, "Tags", tags, [
    { key: "tag_name", relation: false },
    { key: "tag_group_id", relation: true },
    { key: "code", relation: false },
    { key: "value", relation: false }
  ]);

  console.log("tagsMap======>", JSON.stringify(tagsMap, null, 2));
  const fulfillments = getUniqueFulfillments(records);
  console.log(`Fulfillments: ${fulfillments.length}`);
  const fulfillmentMaps = await createObjects(
    client,
    "fulfilments",
    fulfillments,
    [{ key: "type", relation: false }]
  );

  const providers = getUniqueProviders(
    providerRecords,
    domainsMap,
    locationsMap,
    mediaMap,
    countriesMap
  );
  console.log(
    `Providers: ${providers.length} ${JSON.stringify(providers, null, 2)}`
  );
  const providersMap = await createObjects(client, "Providers", providers, [
    { key: "provider_name", relation: false }
  ]);

  const items = getUniqueItems(records, mediaMap, providersMap);
  console.log(`Items: ${items.length}`);
  const itemsMap = await createObjects(client, "Items", items, [
    { key: "name", relation: false },
    { key: "provider", relation: true }
  ]);

  const sc_products = getUniqueSCRetailProducts(
    records,
    itemsMap,
    providersMap
  );
  console.log(`sc-products: ${sc_products.length}`);

  const sc_productsMap = await createObjects(
    client,
    "sc-products",
    sc_products,
    [
      { key: "sku", relation: false },
      { key: "item_id", relation: true }
    ]
  );

  const price_breakups = createPriceBreakupObjects(records, sc_productsMap);
  const price_breakups_response = await createPriceBreakups(
    client,
    price_breakups
  );

  const cat_attr_tag_relations = getCatAttrTagRelations(
    records,
    categoriesMap,
    tagsMap,
    itemsMap,
    providersMap,
    tagGroupsMap
  );
  console.log(`cat_attr_tag_relations: ${cat_attr_tag_relations.length}`);

  const catAttrTagRelationsMap = await createObjects(
    client,
    "cat-attr-tag-relations",
    cat_attr_tag_relations,
    [
      { key: "taxanomy", relation: false },
      { key: "taxanomy_id", relation: false },
      { key: "item", relation: true }
      // { key: "provider", relation: true }
    ]
  );

  const itemFulfillments = getItemFulfillments(
    records,
    providerRecords,
    fulfillmentMaps,
    itemsMap,
    providersMap,
    locationsMap
  );
  console.log(`itemFulfillments: ${itemFulfillments.length}`);
  const itemFulfillmentsMap = await createObjects(
    client,
    "item-fulfillments",
    itemFulfillments,
    [
      { key: "item_id", relation: true },
      { key: "fulfilment_id", relation: true }
    ]
  );
}

if (process.argv.length !== 4) {
  console.log(
    "Please pass the providers csv file and items csv file as arguments"
  );
  process.exit(1);
}

main(process.argv[2], process.argv[3]);
