import { parse } from "ts-command-line-args";

export type ValidationArguments = {
  baseSpec?: string[];
  derivedSpec?: string[];
  sampleJSON?: string[];
  componentPath?: string;
  verbose?: boolean;
  help?: boolean;
};

export function getValidationArguments(): ValidationArguments {
  const validationArguments = parse<ValidationArguments>(
    {
      baseSpec: {
        type: String,
        multiple: true,
        optional: true,
        alias: "b",
        description: "Base yaml spec file",
      },
      derivedSpec: {
        type: String,
        multiple: true,
        optional: true,
        alias: "d",
        description: "Derived yaml spec file",
      },
      sampleJSON: {
        type: String,
        multiple: true,
        optional: true,
        alias: "s",
        description: "Sample JSON file to validate against base yaml spec file",
      },
      componentPath: {
        type: String,
        optional: true,
        alias: "c",
        description: "Component in the spec that corresponds to the JSON sample",
      },
      verbose: {
        type: Boolean,
        alias: "v",
        optional: true,
        defaultValue: true,
        description: "Verbose output on success",
      },
      help: {
        type: Boolean,
        optional: true,
        alias: "h",
        description: "Print Usage guide",
      },
    },
    {
      helpArg: "help",
      headerContentSections: [
        {
          header: "Yaml and JSON validator tool",
          content: `The tool can be operated in one of the following modes based on the requirement
1. To just check an yaml file for yaml syntax, provide it in the baseSpec argument (e.g. -b transaction.yaml)
2. To check if a derived yaml spec is as per another base yaml spec, provide the baseSpec and derivedSpec arguments (e.g. -b transaction.yaml -d mobility.yaml)
3. To just check a json file for json syntax, provide it in the sampleJSON argument (e.g. -s postmanRequest.json)
4. To check if a json file is as per the yaml syntax, provide the baseSpec and sampleJSON arguments -b mobility.yaml -s postmanMobilityRequest.json -c Item

To specify multiple files, just repeat the arguments (e.g. -b transaction.yaml -b meta.yaml)

Examples:
- To check if a file is valid yaml: npm start -- -b __tests__/fixtures/base.yaml\
- To check if a derived yaml is as per the base yaml spec: npm start -- -b __tests__/fixtures/base.yaml -d __tests__/fixtures/derived.yaml
- To check if a file is valid json: npm start -- -s __tests__/fixtures/good_sample.json
- To check if a json object in the file is as per the component in the spec: npm start -- -b __tests__/fixtures/derived.yaml -s __tests__/fixtures/good_sample.json -c Components/Schemas/Car
`,
        },
      ],
      footerContentSections: [{ header: "Author", content: `Beckn team` }],
    }
  );
  if (kosherArguments(validationArguments)) {
    return validationArguments;
  } else {
    console.log("Wrong Configuration!!! Use -h to see usage guide");
    process.exit(1);
  }
}

function kosherArguments(args: ValidationArguments): boolean {
  if (args.baseSpec?.length == 0) args.baseSpec = undefined;
  if (args.derivedSpec?.length == 0) args.derivedSpec = undefined;
  if (args.sampleJSON?.length == 0) args.sampleJSON = undefined;
  if (!args.baseSpec && !args.sampleJSON) {
    console.log("Either specification or sample should be provided");
    return false;
  }
  if (args.derivedSpec && !args.baseSpec) {
    console.log("When derived spec is specified, base spec should also be specified");
    return false;
  }
  if (args.baseSpec && args.sampleJSON && !args.componentPath) {
    console.log("To verify sample, the path of the component should be specified");
    return false;
  }
  if (args.baseSpec && args.derivedSpec && args.sampleJSON) {
    console.log("All three of base spec, derived spec and sample json cannot be used together");
    return false;
  }
  return true;
}

export const exportedForTesting = {
  kosherArguments,
};
