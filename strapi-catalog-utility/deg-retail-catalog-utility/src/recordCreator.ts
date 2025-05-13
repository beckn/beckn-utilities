/* eslint-disable @typescript-eslint/no-explicit-any */

export const getUniqueCountries = (records: any[]) => {
  const countries = [
    ...new Set(
      records.map((rec) => {
        return { country: rec.Country, code: rec.country_code };
      })
    )
  ];
  return countries.map((country) => {
    return {
      name: country.country,
      code: country.code
    };
  });
};
export function getUniqueDomains(records: any[]) {
  const domains = [
    ...new Set(
      records.map((rec) => {
        return rec.DOMAIN;
      })
    )
  ].filter((e) => e);
  return domains.map((domain) => {
    return {
      DomainName: domain
    };
  });
}

export function getUniqueLocations(records: any[]) {
  const gpss = [
    ...new Set(
      records.map((rec) => {
        return rec.gps;
      })
    )
  ].filter((e) => e);
  return gpss.map((gps) => {
    const record = records.find((rec) => rec.gps === gps);
    try {
      return {
        address: record.Address,
        city: record.City,
        state: record.State,
        country: record.Country,
        zip: record.zip,
        // latitude: record.gps.split(",")[0].trim(),
        // longitude: record.gps.split(",")[1].trim(),
        gps: record.gps
      };
    } catch (err) {
      console.log("Error in ", record);
      process.exit(1);
    }
  });
}

export function getUniqueMedia(records: any[], providerRecords: any[]) {
  const images = [
    ...new Set(
      records
        .map((rec) => {
          return rec.Logo_image_url;
        })
        .concat(
          providerRecords.map((rec) => {
            return rec.provider_Logo_image_url;
          })
        )
    )
  ].filter((e) => e);
  return images.map((image) => {
    return {
      url: image,
      size_type: "sm"
    };
  });
}

export function getUniqueCategories(records: any[]) {
  const categoryNames = [
    ...new Set(
      records.map((rec) => {
        return rec["category name"];
      })
    )
  ].filter((e) => e);
  return categoryNames.map((categoryName) => {
    const record = records.find((rec) => rec["category name"] === categoryName);
    return {
      title: record["category code"],
      value: record["category name"],
      category_code: record["category code"]
    };
  });
}

export function getUniqueTagGroups(records: any[]) {
  const uniqueMap = new Map();

  records.forEach((rec) => {
    if (rec.tag_group_code_1) {
      const tagGroup1 = rec.tag_group_code_1;
      if (!uniqueMap.has(tagGroup1)) {
        uniqueMap.set(tagGroup1, {
          tag_group_name: tagGroup1,
          code: tagGroup1,
          display: true
        });
      }
    }

    if (rec.tag_group_code_2) {
      const tagGroup2 = rec.tag_group_code_2;
      if (!uniqueMap.has(tagGroup2)) {
        uniqueMap.set(tagGroup2, {
          tag_group_name: tagGroup2,
          code: tagGroup2,
          display: true
        });
      }
    }

    if (rec.tag_group_code_3) {
      const tagGroup3 = rec.tag_group_code_3;
      if (!uniqueMap.has(tagGroup3)) {
        uniqueMap.set(tagGroup3, {
          tag_group_name: tagGroup3,
          code: tagGroup3,
          display: true
        });
      }
    }
  });

  return Array.from(uniqueMap.values());
}

export function getUniqueTags(records: any[], tagGroupsMap: any) {
  const uniqueMapTagGroup1 = new Map();
  const uniqueMapTagGroup2 = new Map();
  const uniqueMapTagGroup3 = new Map();

  records.forEach((rec) => {
    if (rec.tag_group_code_1) {
      const names_tagGroup1 = rec.tag_name_1.split(",");
      const codes_tagGroup1 = rec.code_1.split(",");
      const values_tagGroup1 = rec.value_1.toString().split(",");

      for (let i = 0; i < names_tagGroup1.length; i++) {
        const tag = names_tagGroup1[i].trim();
        const code = codes_tagGroup1[i]?.trim() || tag;
        const value = values_tagGroup1[i]?.trim() || tag;
        const key = `${tag}|${code}|${value}`;

        if (!uniqueMapTagGroup1.has(key)) {
          uniqueMapTagGroup1.set(key, {
            tag_name: tag,
            code,
            value,
            display: true,
            tag_group_id: tagGroupsMap[rec.tag_group_code_1]
          });
        }
      }
    }

    if (rec.tag_group_code_2) {
      const names_tagGroup2 = rec.tag_name_2.split(",");
      const codes_tagGroup2 = rec.code_2.split(",");
      const values_tagGroup2 = rec.value_2.toString().split(",");

      for (let i = 0; i < names_tagGroup2.length; i++) {
        const tag = names_tagGroup2[i].trim();
        const code = codes_tagGroup2[i]?.trim() || tag;
        const value = values_tagGroup2[i]?.trim() || tag;
        const key = `${tag}|${code}|${value}`;

        if (!uniqueMapTagGroup2.has(key)) {
          uniqueMapTagGroup2.set(key, {
            tag_name: tag,
            code,
            value,
            display: true,
            tag_group_id: tagGroupsMap[rec.tag_group_code_2]
          });
        }
      }
    }

    if (rec.tag_group_code_3) {
      const names_tagGroup3 = rec.tag_name_3.split(",");
      const codes_tagGroup3 = rec.code_3.split(",");
      const values_tagGroup3 = rec.value_3.toString().split(",");

      for (let i = 0; i < names_tagGroup3.length; i++) {
        const tag = names_tagGroup3[i].trim();
        const code = codes_tagGroup3[i]?.trim() || tag;
        const value = values_tagGroup3[i]?.trim() || tag;
        const key = `${tag}|${code}|${value}`;

        if (!uniqueMapTagGroup3.has(key)) {
          uniqueMapTagGroup3.set(key, {
            tag_name: tag,
            code,
            value,
            display: true,
            tag_group_id: tagGroupsMap[rec.tag_group_code_3]
          });
        }
      }
    }
  });

  return [
    ...Array.from(uniqueMapTagGroup1.values()),
    ...Array.from(uniqueMapTagGroup2.values()),
    ...Array.from(uniqueMapTagGroup3.values())
  ];
}

export function getUniqueFulfillments(records: any[]) {
  const fulfillments = [
    ...new Set(
      records.flatMap((rec) => {
        const names = rec.fulfillments.split(",");
        return names.map((name: string) => name.trim());
      })
    )
  ].filter((e) => e);
  return fulfillments.map((fulfillment: string) => {
    return {
      type: fulfillment,
      rateable: true
    };
  });
}

export function getUniqueProviders(
  records: any[],
  domainsMap: any,
  locationsMap: any,
  mediaMap: any,
  countriesMap: any
) {
  const providerHashes = [
    ...new Set(
      records.map((rec) => {
        return rec.provider_name + ":::" + rec.gps;
      })
    )
  ].filter((e) => e);
  console.log(countriesMap);
  return providerHashes.map((providerHash) => {
    const record = records.find(
      (rec) => rec.provider_name + ":::" + rec.gps === providerHash
    );

    return {
      provider_name: record.provider_name,
      short_desc: record.provider_short_desc,
      long_desc: record.provider_long_desc,
      provider_id: record.provider_id,
      provider_uri: record.provider_uri,
      domain_id: domainsMap[record.DOMAIN],
      location_id: locationsMap[record.gps],
      logo: mediaMap[record.provider_Logo_image_url],
      country: countriesMap[`${record.Country}:::${record.country_code}`]
    };
  });
}

export function getUniqueItems(
  records: any[],
  mediaMap: any,
  providersMap: any
) {
  const itemHashes = [
    ...new Set(
      records.map((rec) => {
        return rec.Item_name + ":::" + rec.provider_name;
      })
    )
  ].filter((e) => e);

  return itemHashes.map((itemHash, i) => {
    const record = records.find(
      (rec) => rec.Item_name + ":::" + rec.provider_name === itemHash
    );

    return {
      name: record.Item_name,
      short_desc: record.short_desc,
      long_desc: record.long_desc,
      code: record.Item_name,
      max_quantity: record.max_quantity,
      min_quantity: record.min_quantity,
      image: [mediaMap[record.Logo_image_url]],
      provider: providersMap[record.provider_name]
    };
  });
}

export function getUniqueSCRetailProducts(
  records: any[],
  itemsMap: any,
  providersMap: any
) {
  const skuhashes = [
    ...new Set(
      records.map((rec) => {
        return rec.sku + ":::" + rec.Item_name + ":::" + rec.provider_name;
      })
    )
  ].filter((e) => e);
  return skuhashes.map((skuhash) => {
    const record = records.find(
      (rec) =>
        rec.sku + ":::" + rec.Item_name + ":::" + rec.provider_name === skuhash
    );
    const providerKey = record.provider_name;
    const itemKey = record.Item_name + ":::" + providersMap[providerKey];
    return {
      sku: record.sku,
      min_price: record.min_price,
      max_price: record.max_price,
      stock_quantity: record.stock_quantity,
      stock_status: record.stock_status,
      currency: record.currency,
      item_id: itemsMap[itemKey]
    };
  });
}

export function getCatAttrTagRelations(
  records: any[],
  categoriesMap: any,
  tagsMap: any,
  itemsMap: any,
  providersMap: any,
  tagGroupsMap: any
) {
  console.log("tagsMap", JSON.stringify(tagsMap, null, 2));

  return records.flatMap((record) => {
    const retVal = [];
    const providerKey = record.provider_name;
    const providerId = providersMap[providerKey];
    const itemKey = record.Item_name + ":::" + providerId;
    const itemId = itemsMap[itemKey];
    const categoryName = record["category name"];
    const categoryId = categoriesMap[categoryName];
    retVal.push({
      taxanomy: "CATEGORY",
      taxanomy_id: `${categoryId}`,
      item: itemId,
      provider: providerId
    });

    if (record.tag_group_code_1) {
      let tagNames_tagGroup1 = record.tag_name_1.split(",");
      tagNames_tagGroup1 = tagNames_tagGroup1.map((name: string) =>
        name.trim()
      );

      let tagCodes_tagGroup1 = record.code_1.split(",");
      tagCodes_tagGroup1 = tagCodes_tagGroup1.map((code: string) =>
        code.trim()
      );

      let tagValues_tagGroup1 = record.value_1.split(",");
      tagValues_tagGroup1 = tagValues_tagGroup1.map((value: string) =>
        value.trim()
      );

      for (let i = 0; i < tagNames_tagGroup1.length; i++) {
        const tagName = `${tagNames_tagGroup1[i]}:::${
          tagGroupsMap[record.tag_group_code_1]
        }:::${tagCodes_tagGroup1[i]}:::${tagValues_tagGroup1[i]}`;
        console.log("tagName===>", tagName);
        const tagId = tagsMap[tagName];
        retVal.push({
          taxanomy: "TAG",
          taxanomy_id: `${tagId}`,
          item: itemId,
          provider: providerId
        });
      }
    }

    if (record.tag_group_code_2) {
      let tagNames_tagGroup2 = record.tag_name_2.split(",");
      tagNames_tagGroup2 = tagNames_tagGroup2.map((name: string) =>
        name.trim()
      );

      let tagCodes_tagGroup2 = record.code_2.split(",");
      tagCodes_tagGroup2 = tagCodes_tagGroup2.map((code: string) =>
        code.trim()
      );

      let tagValues_tagGroup2 = record.value_2.split(",");
      tagValues_tagGroup2 = tagValues_tagGroup2.map((value: string) =>
        value.trim()
      );

      for (let i = 0; i < tagNames_tagGroup2.length; i++) {
        const tagName = `${tagNames_tagGroup2[i]}:::${
          tagGroupsMap[record.tag_group_code_2]
        }:::${tagCodes_tagGroup2[i]}:::${tagValues_tagGroup2[i]}`;
        console.log("tagName===>", tagName);
        const tagId = tagsMap[tagName];
        retVal.push({
          taxanomy: "TAG",
          taxanomy_id: `${tagId}`,
          item: itemId,
          provider: providerId
        });
      }
    }

    if (record.tag_group_code_3) {
      let tagNames_tagGroup3 = record.tag_name_3.split(",");
      tagNames_tagGroup3 = tagNames_tagGroup3.map((name: string) =>
        name.trim()
      );

      let tagCodes_tagGroup3 = record.code_3.split(",");
      tagCodes_tagGroup3 = tagCodes_tagGroup3.map((code: string) =>
        code.trim()
      );

      let tagValues_tagGroup3 = record.value_3.split(",");
      tagValues_tagGroup3 = tagValues_tagGroup3.map((value: string) =>
        value.trim()
      );

      for (let i = 0; i < tagNames_tagGroup3.length; i++) {
        const tagName = `${tagNames_tagGroup3[i]}:::${
          tagGroupsMap[record.tag_group_code_3]
        }:::${tagCodes_tagGroup3[i]}:::${tagValues_tagGroup3[i]}`;
        console.log("tagName===>", tagName);
        const tagId = tagsMap[tagName];
        retVal.push({
          taxanomy: "TAG",
          taxanomy_id: `${tagId}`,
          item: itemId,
          provider: providerId
        });
      }
    }

    return retVal;
  });
}

export function getItemFulfillments(
  records: any[],
  providerRecords: any[],
  fulfillmentMaps: any,
  itemsMap: any,
  providersMap: any,
  locationsMap: any
) {
  return records.flatMap((record) => {
    const providerRecord = providerRecords.find(
      (r) => r.provider_name === record.provider_name
    );
    const retVal = [];
    const locationId = locationsMap[providerRecord.gps];
    const providerKey = record.provider_name;
    const providerId = providersMap[providerKey];
    const itemKey = record.Item_name + ":::" + providerId;
    const itemId = itemsMap[itemKey];
    let fulfillmentNames = record.fulfillments.split(",");
    fulfillmentNames = fulfillmentNames.map((name: string) => name.trim());
    for (const fulfillmentName of fulfillmentNames) {
      const fulfillmentId = fulfillmentMaps[fulfillmentName];
      //HARDCODED DATA
      let timestamp = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      );
      if (fulfillmentName === "CHECK-OUT")
        timestamp = new Date(
          new Date().setFullYear(new Date().getFullYear() + 5)
        );

      retVal.push({
        item_id: itemId,
        fulfilment_id: fulfillmentId,
        location_id: locationId,
        timestamp: timestamp
      });
    }
    return retVal;
  });
}

function getDuplicates(records: any[], keys: any[]): any[] {
  const valueSet = new Set();
  let index = 0;
  const duplicates = [];
  for (const record of records) {
    index += 1;
    let value = "";
    if (keys.length === 1) {
      value = record[keys[0]];
    } else {
      for (const key of keys) {
        value += record[key];
        value += " ";
      }
    }
    if (valueSet.has(value))
      duplicates.push(`Line:${index + 1} ${JSON.stringify(record)}`);
    else valueSet.add(value);
  }
  return duplicates;
}

export function hasDuplicates(providerRecords: any[], records: any[]) {
  const providerDuplicates = getDuplicates(providerRecords, ["provider_name"]);
  if (providerDuplicates.length > 0) {
    console.log("Fix the following duplicates in the providers file");
    console.log(JSON.stringify(providerDuplicates));
    return true;
  }
  const itemDuplicates = getDuplicates(records, ["provider_name", "Item_name"]);
  if (itemDuplicates.length > 0) {
    console.log("Fix the following duplicates in the items file");
    console.log(JSON.stringify(itemDuplicates));
    return true;
  }
  return false;
}

export const createPriceBreakupObjects = (
  records: any[],
  sc_retail_products_map: any
) => {
  try {
    return Object.keys(sc_retail_products_map)
      .map((sc_retail_product) => {
        const matched_record = records.find(
          (record) => record["sku"] === sc_retail_product.split(":::")[0]
        );

        if (matched_record) {
          return {
            sc_retail_product_id: sc_retail_products_map[sc_retail_product],
            price_breakups: [
              {
                title: "BASE PRICE",
                currency: matched_record.currency,
                value: matched_record.base_price
              },
              {
                title: "TAX",
                currency: matched_record.currency,
                value: matched_record.tax
              }
            ]
          };
        }
      })
      .filter(Boolean);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
