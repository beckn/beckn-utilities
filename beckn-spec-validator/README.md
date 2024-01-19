## Yaml and JSON validator tool

This tool helps validate Beckn domain specific yaml files as well as json examples of nodes from the corresponding yaml spec.

The tool can be operated in one of the following modes based on the requirement

1. To just check an yaml file for yaml syntax, provide it in the baseSpec argument (e.g. -b transaction.yaml)
2. To check if a derived yaml spec is as per another base yaml spec, provide the baseSpec and derivedSpec arguments (e.g. -b transaction.yaml -d mobility.yaml)
3. To just check a json file for json syntax, provide it in the sampleJSON argument (e.g. -s postmanRequest.json)
4. To check if a json file is as per the yaml syntax, provide the baseSpec and sampleJSON arguments -b mobility.yaml -s intentSample.json -c components.schemas.Intent

Modes 2 and 4 above are the primary use cases and they will also do the checks in mode 1 and 3.

## Options

To specify multiple files, just repeat the arguments (e.g. ts-node src/validate.ts -b transaction.yaml -b meta.yaml)

```
-b, --baseSpec string[] - Base yaml spec file
-d, --derivedSpec string[] - Derived yaml spec file
-s, --sampleJSON string[] - Sample JSON file to validate against base yaml spec file
-c, --componentPath string - Path of the component that JSON is example of
-v, --verbose boolean - Whether to print messages during the successful validation
-h, --help - Print Usage guide
```

## How to install

### Pre requirements

- Node, Git and NPM should be installed on the machine

### Installation
- Run the following command

```
npm install -g beckn-spec-validator
```

## How to run

- Here are some sample ways to run the tool. Beckn examples (yaml and json files not included in repo)

```
// Check if the mobility spec is valid derivation of core spec
beckn-spec-validator -b temp/core.yaml -d temp/mobility.yaml

// Check if a mobility search request is as per the spec
beckn-spec-validator -b temp/mobility.yaml -s temp/mobility_search_request.json -c paths./search.post.requestBody.content.application/json.schema

// Check if a mobility search response is as per the spec
beckn-spec-validator -b temp/mobility.yaml -s temp/mobility_on_search.json -c paths./on_search.post.requestBody.content.application/json.schema

// Check if a component json is as per the component schema specified in the mobility spec
beckn-spec-validator -b temp/mobility.yaml -s temp/fulfillment.json -c components.schemas.Fulfillment

```

### Installation and run from source code

- Clone the parent repository(it has multiple tools) using `git clone https://github.com/beckn/beckn-utilities.git`
- Goto the beckn-spec-validator subfolder within the beckn-utilities folder.
- Run `npm install` to install libraries that this tool depends on
- Run `npm start -- -h` to see usage instructions. Note the space between `--` and `-h`
- You can run the following fixture files.

```
// To check if a file is valid yaml
npm start -- -b __tests__/fixtures/base.yaml
npm start -- -b __tests__/fixtures/bad_yaml.yaml

//To check if a derived yaml is as per the base yaml spec
npm start -- -b __tests__/fixtures/base.yaml -d __tests__/fixtures/derived.yaml
npm start -- -b __tests__/fixtures/base.yaml -d __tests__/fixtures/bad_derived.yaml

//To check if a file is valid json
npm start -- -s __tests__/fixtures/good_sample.json
npm start -- -s __tests__/fixtures/bad_json.json

//To check if a json object in the file is as per the component in the spec
npm start -- -b __tests__/fixtures/derived.yaml -s __tests__/fixtures/good_sample.json -c components.schemas.Car
npm start -- -b __tests__/fixtures/derived.yaml -s __tests__/fixtures/bad_sample.json -c components.schemas.Car

```

## How to run tests

- After you run the install steps above, run `npm run test -- --silent`

## How to use this as a pre-commit hook.

- Because each time we run the validator tool with a different file, it requires different command line arguments, using this as a pre-commit hook is a bit unweildy. However this [Precommit-hook instructions](Precommit-hook.md) gives some tips on how to do it.
