import { readFile } from "fs/promises";
import { createObjectCsvWriter } from "csv-writer";

class Product {
  name: string = "";
  slug: string = "";
  description: string = "";
  assets: string = "";
  facets: string = "";
  optionGroups = "";
  optionValues = "";
  sku: string = "";
  price: number = 0;
  taxCategory = "standard";
  stockOnHand = 10000;
  trackInventory = false;
  variantAssets = "";
  variantFacets = "";
}

async function processFile(shopName: string, fileName: string) {
  const contents = JSON.parse((await readFile(fileName)).toString());
  const responses = contents.responses;
  const shop = _findShop(responses, shopName);
  if (shop === null) {
    console.log("Could not find shop");
    return [];
  }
  const items = shop.items;
  const products = [];
  for (const item of items) {
    const product = new Product();
    product.name = item.descriptor.name;
    product.description = item.descriptor.short_desc + " " + item.descriptor.long_desc;
    product.assets = item.descriptor.images.join("|");
    product.sku = shop.descriptor.name.substring(0, 2).toUpperCase() + Math.floor(Math.random() * 10000000);
    product.price = Number(item.price.listed_value);
    let facetString = "";
    const categories = [];
    const facets = new Map();
    for (const tagname in item.tags) {
      if (tagname.startsWith("fulfillment")) continue;
      if (tagname.toLowerCase() === "category") {
        facetString += `category:${item.tags[tagname]}|`;
      } else if (item.tags[tagname] === "Y" || item.tags[tagname] === "y") {
        facetString += `category:${tagname}|`;
      } else {
        facetString += `${tagname}:${item.tags[tagname]}|`;
      }
    }
    if (facetString[facetString.length - 1] === "|") facetString = facetString.substring(0, facetString.length - 1);
    product.facets = facetString;
    products.push(product);
  }
  return products;
}

function _findShop(responses: any[], shopName: string) {
  for (const response of responses) {
    const providers = response.message.catalog["bpp/providers"];
    for (const provider of providers) {
      if (provider.descriptor.name === shopName) return provider;
    }
  }
  return null;
}

async function main() {
  if (process.argv.length < 5) {
    console.log(
      "Usage: node build/search_result_to_vendure_csv.js  [ShopName] [Input JSON Filename] [Output CSV Filename"
    );
    console.log("Please provide shop name input json file name and output csv file name as three arguments");
    process.exit(0);
  }
  const shopName = process.argv[2];
  const fileName = process.argv[3];
  const opFileName = process.argv[4];
  console.log(`Processing items for shop ${shopName} from ${fileName}`);
  const products = await processFile(shopName, fileName);
  if (products.length === 0) {
    console.log("Could not find items in the specified shop");
    process.exit(0);
  }

  const csvWriter = createObjectCsvWriter({
    path: opFileName,
    header: [
      { id: "name", title: "name" },
      { id: "slug", title: "slug" },
      { id: "description", title: "description" },
      { id: "assets", title: "assets" },
      { id: "facets", title: "facets" },
      { id: "optionGroups", title: "optionGroups" },
      { id: "optionValues", title: "optionValues" },
      { id: "sku", title: "sku" },
      { id: "price", title: "price" },
      { id: "taxCategory", title: "taxCategory" },
      { id: "stockOnHand", title: "stockOnHand" },
      { id: "trackInventory", title: "trackInventory" },
      { id: "variantAssets", title: "variantAssets" },
      { id: "variantFacets", title: "variantFacets" },
    ],
  });
  await csvWriter.writeRecords(products);
  console.log(`Successfully wrote ${products.length} products to file`);
}

main();
