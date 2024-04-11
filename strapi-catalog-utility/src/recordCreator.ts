/* eslint-disable @typescript-eslint/no-explicit-any */

export function get_unique_domains(records: any[]) {
  const domains = [
    ...new Set(
      records.map((rec) => {
        return rec.DOMAIN;
      })
    ),
  ].filter((e) => e);
  return domains.map((domain) => {
    return {
      DomainName: domain,
    };
  });
}

export function get_unique_locations(records: any[]) {
  const gpss = [
    ...new Set(
      records.map((rec) => {
        return rec.gps;
      })
    ),
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
        latitude: record.gps.split(",")[0].trim(),
        longitude: record.gps.split(",")[1].trim(),
        gps: record.gps,
      };
    } catch (err) {
      console.log("Error in ", record);
    }
  });
}

export function get_unique_media(records: any[]) {
  const images = [
    ...new Set(
      records.flatMap((rec) => {
        return [rec.Logo_image_url, rec.provider_Logo_image_url];
      })
    ),
  ].filter((e) => e);
  return images.map((image) => {
    return {
      url: image,
      size_type: "sm",
    };
  });
}

export function get_unique_categories(records: any[]) {
  const categoryNames = [
    ...new Set(
      records.map((rec) => {
        return rec["category name"];
      })
    ),
  ].filter((e) => e);
  return categoryNames.map((categoryName) => {
    const record = records.find((rec) => rec["category name"] === categoryName);
    return {
      value: record["category name"],
      category_code: record["category code"],
    };
  });
}

export function get_unique_tags(records: any[]) {
  const tags = [
    ...new Set(
      records.flatMap((rec) => {
        const names = rec.tag_name.split(",");
        return names.map((name: string) => name.trim());
      })
    ),
  ].filter((e) => e);
  return tags.map((tag: string) => {
    return {
      tag_name: tag,
      code: tag.toLowerCase().replace(" ", "_"),
      value: tag,
      display: true,
    };
  });
}

export function get_unique_fulfillments(records: any[]) {
  const fulfillments = [
    ...new Set(
      records.flatMap((rec) => {
        const names = rec.fulfillments.split(",");
        return names.map((name: string) => name.trim());
      })
    ),
  ].filter((e) => e);
  return fulfillments.map((fulfillment: string) => {
    return {
      type: fulfillment,
      rateable: true,
    };
  });
}

export function get_unique_providers(records: any[], domainsMap: any, locationsMap: any, mediaMap: any) {
  const providerHashes = [
    ...new Set(
      records.map((rec) => {
        return rec.provider_name + ":::" + rec.gps;
      })
    ),
  ].filter((e) => e);
  return providerHashes.map((providerHash) => {
    const record = records.find((rec) => rec.provider_name + ":::" + rec.gps === providerHash);
    return {
      provider_name: record.provider_name,
      short_desc: record.provider_short_desc,
      long_desc: record.provider_long_desc,
      provider_id: record.provider_id,
      provider_uri: record.provider_uri,
      domain_id: domainsMap[record.DOMAIN],
      location_id: locationsMap[record.gps],
      logo: mediaMap[record.provider_Logo_image_url],
    };
  });
}

export function get_unique_items(records: any[], mediaMap: any, providersMap: any, locationsMap: any) {
  const itemHashes = [
    ...new Set(
      records.map((rec) => {
        return rec.Item_name + ":::" + rec.provider_name + ":::" + rec.gps;
      })
    ),
  ].filter((e) => e);
  return itemHashes.map((itemHash) => {
    const record = records.find((rec) => rec.Item_name + ":::" + rec.provider_name + ":::" + rec.gps === itemHash);
    const providerKey = record.provider_name + ":::" + locationsMap[record.gps];
    return {
      name: record.Item_name,
      short_desc: record.short_desc,
      long_desc: record.long_desc,
      code: record.code,
      max_quantity: record.max_quantity,
      min_quantity: record.min_quantity,
      image: [mediaMap[record.Logo_image_url]],
      provider: providersMap[providerKey],
    };
  });
}

export function get_sc_products(records: any[], itemsMap: any, providersMap: any, locationsMap: any) {
  const skuhashes = [
    ...new Set(
      records.map((rec) => {
        return rec.sku + ":::" + rec.Item_name + ":::" + rec.provider_name + ":::" + rec.gps;
      })
    ),
  ].filter((e) => e);
  return skuhashes.map((skuhash) => {
    const record = records.find(
      (rec) => rec.sku + ":::" + rec.Item_name + ":::" + rec.provider_name + ":::" + rec.gps === skuhash
    );
    const providerKey = record.provider_name + ":::" + locationsMap[record.gps];
    const itemKey = record.Item_name + ":::" + providersMap[providerKey];
    return {
      sku: record.sku,
      min_price: record.min_price,
      max_price: record.max_price,
      stock_quantity: record.stock_quantity,
      stock_status: record.stock_status,
      item_id: itemsMap[itemKey],
    };
  });
}

export function get_cat_attr_tag_relations(
  records: any[],
  categoriesMap: any,
  tagsMap: any,
  itemsMap: any,
  providersMap: any,
  locationsMap: any
) {
  return records.flatMap((record) => {
    const retVal = [];
    const providerKey = record.provider_name + ":::" + locationsMap[record.gps];
    const providerId = providersMap[providerKey];
    const itemKey = record.Item_name + ":::" + providerId;
    const itemId = itemsMap[itemKey];
    const categoryName = record["category name"];
    const categoryId = categoriesMap[categoryName];
    retVal.push({
      taxanomy: "CATEGORY",
      taxanomy_id: `${categoryId}`,
      item: itemId,
      provider: providerId,
    });
    let tagNames = record.tag_name.split(",");
    tagNames = tagNames.map((name: string) => name.trim());
    for (const tagName of tagNames) {
      const tagId = tagsMap[tagName];
      retVal.push({
        taxanomy: "TAG",
        taxanomy_id: `${tagId}`,
        item: itemId,
        provider: providerId,
      });
    }
    return retVal;
  });
}

export function getItemFulfillments(
  records: any[],
  fulfillmentMaps: any,
  itemsMap: any,
  providersMap: any,
  locationsMap: any
) {
  return records.flatMap((record) => {
    const retVal = [];
    const locationId = locationsMap[record.gps];
    const providerKey = record.provider_name + ":::" + locationId;
    const providerId = providersMap[providerKey];
    const itemKey = record.Item_name + ":::" + providerId;
    const itemId = itemsMap[itemKey];
    let fulfillmentNames = record.fulfillments.split(",");
    fulfillmentNames = fulfillmentNames.map((name: string) => name.trim());
    for (const fulfillmentName of fulfillmentNames) {
      const fulfillmentId = fulfillmentMaps[fulfillmentName];
      //HARDCODED DATA
      let timestamp = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      if (fulfillmentName === "CHECK-OUT") timestamp = new Date(new Date().setFullYear(new Date().getFullYear() + 5));

      retVal.push({
        item_id: itemId,
        fulfilment_id: fulfillmentId,
        location_id: locationId,
        timestamp: timestamp,
      });
    }
    return retVal;
  });
}

export function print_duplicates(records: any[]) {
  const keySet = new Set();
  let index = 0;
  for (const record of records) {
    index += 1;
    const key = record.Item_name + ":::" + record.provider_name + ":::" + record.gps;
    if (keySet.has(key)) console.log(`${index} ${JSON.stringify(record)}`);
    else keySet.add(key);
  }
}
