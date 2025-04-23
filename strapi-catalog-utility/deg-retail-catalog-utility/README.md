# Strapi Catalog Utility

## Introduction

This utility can be used to insert a catalog present in csv files into a strapi instance.

## Usage

1. Clone this repository.
2. Copy the .samplenv file into .env file and fill in the Strapi server address and the API key required to talk to the Strapi REST API.
3. Create two files, one with provider details and one with item details. You can find the **sample format** of these files in the samples folder
4. Install the required libraries using `npm install`
5. WARNING: Running the utility will make permanent entries into the Strapi DB. So ensure you have the right Strapi server and the right csv files. Run the utility using the command `npm run start -- providers.csv items.csv` where `providers.csv` is the path to the csv file with the providers info and `items.csv` is the path to the csv file with item info.

## Tips for catalog creators

1. Create the providers file with one row per shop. Remember that the name of the provider should be unique. If you have a lot of shops with the same name, add some discriminator (e.g. area) to the name. For example 'JioMart, Rajajinagar', 'JioMart, Indiranagar'.
2. The providers name in the items file should exactly match the provider name in the providers file. Within the items file, the primary key is a combination of Providers Name and Item name.
3. Please verify the right Strapi Server in the .env file. Remember to recheck this everytime before you run the utility.

## Tips for developers

1. This file has to be run and kept upto date whenever Strapi db structure changes.
2. Currently in Strapi, the item-fulfillment has timestamp to support CHECK-IN/CHECK-OUT Fulfillments. The tool has hard coded this. In future if we support fulfillments with different attributes, we will have to have a similar csv to providers for fulfillments.
