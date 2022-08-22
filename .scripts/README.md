# Scripts

This directory contains some scripts for the pipeline templates that are generated.

1. One Click Pipeline Generator
2. Test Script

## One Click Pipeline Generator

This script takes care of generating an `oneclick.json` version of the passed pipeline by resolving the `scriptRef` dependencies of all the stages. It can be used in the following way:

```sh
yarn one-click <path to the pipeline file>
```

> NOTE: The `path to the pipeline file` should be a valid path and can be either `yaml` or `json`. Moreover, the `scriptRef` dependencies will be searched for in the same directory that the pipeline file is present in.

## Test Script

It is important to test the pipelines before they are allowed to be used by the users. A `validate` script takes care of validating the pipeline given that some sane `response` expectations are specified in to the script.

This script uses the passed details by the user and hits the `/_pipeline/validate` endpoint with a sample request body (provided by user through validator file) and matches the response to the expected response.

### Usage

Script can be used in the following way:

```sh
yarn test <path to pipeline oneclick file> <path to validator file>
```

In the above:

- `path to pipeline oneclick file`: This should be the path to the pipeline JSON file.
- `path to validator file`: This should be the path to the pipeline validator JSON file.

#### Pipeline Validator JSON

This JSON file should specify how the pipeline's validation is done. It should be in the following format:

```json
{
  "request": { 
     "headers": {},
     "body": ""
   },
  "response": { ... },
  "matchCriteriaPath": "", 
  "matchCriteriaStatus": ""
}
```

- `request.headers` should be an object containing headers to be passed in the request.
- `request.body` should be a stringified JSON that will be sent in the `validate` request as is.
- `response` should be an object that will be matched against the received response.
- `matchCriteriaPath` should be the path of the response to match against the received one. If empty, whole response is considered.
- `matchCriteriaStatus` should be the expected status code in the response. This will be set to `200` by default.

