## Yaml and JSON validator tool

To specify multiple files, just repeat the arguments (e.g. ts-node src/validate.ts -b transaction.yaml -b meta.yaml)

The tool can be operated in one of the following modes based on the requirement

1. To just check an yaml file for yaml syntax, provide it in the baseSpec argument (e.g. -b transaction.yaml)
2. To check if a derived yaml spec is as per another base yaml spec, provide the baseSpec and derivedSpec arguments (e.g. -b transaction.yaml -d mobility.yaml)
3. To just check a json file for json syntax, provide it in the sampleJSON argument (e.g. -s postmanRequest.json)
4. To check if a json file is as per the yaml syntax, provide the baseSpec and sampleJSON arguments -b mobility.yaml -s postmanMobilityRequest.json

## Options

-b, --baseSpec string[] Base yaml spec file  
-d, --derivedSpec string[] Derived yaml spec file  
-s, --sampleJSON string[] Sample JSON file to validate against base yaml spec file
-h, --help Print Usage guide
