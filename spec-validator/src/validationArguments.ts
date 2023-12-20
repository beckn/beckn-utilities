import { parse } from "ts-command-line-args";

export type ValidationArguments = {
  baseSpec?: string[];
  derivedSpec?: string[];
  sampleJSON?: string[];
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
4. To check if a json file is as per the yaml syntax, provide the baseSpec and sampleJSON arguments -b mobility.yaml -s postmanMobilityRequest.json

To specify multiple files, just repeat the arguments (e.g. -b transaction.yaml -b meta.yaml)`,
        },
      ],
      footerContentSections: [{ header: "Author", content: `Beckn utilities` }],
    }
  );
  if (kosherArguments(validationArguments)) {
    return validationArguments;
  } else {
    console.log("Use -h to see usage guide");
    process.exit(1);
  }
}

function kosherArguments(args: ValidationArguments): boolean {
  if (args.baseSpec?.length == 0) args.baseSpec = undefined;
  if (args.derivedSpec?.length == 0) args.derivedSpec = undefined;
  if (args.sampleJSON?.length == 0) args.sampleJSON = undefined;
  if (
    JSON.stringify(args) === "{}" ||
    (args.derivedSpec && !args.baseSpec) ||
    (args.baseSpec && args.derivedSpec && args.sampleJSON)
  ) {
    return false;
  }
  return true;
}

export const exportedForTesting = {
  kosherArguments,
};
