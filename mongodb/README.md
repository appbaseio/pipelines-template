# MongoDB

This pipeline explains how MongoDB can be used as a search backend with ReactiveSearch. MongoDB is compatible with all the other search relevancy features of ReactiveSearch.

## Envs

Since MongoDB is a custom backend, it requires a few inputs in order to be able to run properly. This pipeline expects the following inputs for the MongoDB pipeline to run properly:

- `MONGO_HOST`: The host address of the mongoDB instance. This can be an IP address or a domain.
- `MONGO_DB`: The name of the database to connect to in the MongoDB instance.
- `MONGO_COLLECTION`: The collection to use after connecting to MongoDB.
- `MONGO_CREDS`: Credentials in order to access the mongoDB instance. This should be in the format of `<username>:<password>` without the `<`, `>`.

## Authorization

As a good practice, authorization is always the first stage in a public user facing pipeline. This stage ensures that only valid credentials are allowed access to the endpoint and all other requests are denied.

## ReactiveSearch Query

This is just the ReactiveSearch Query stage where the request is converted to MongoDB equivalent. Thing to note here is that the `inputs.backend` field is passed as `mongodb`.

This is important because the `backend` value is by default set to ElasticSearch so setting this makes sure that the conversion from RS request body to MongoDB request body is successful.

## Extract Envs from Context

Since a lot of values that are required as inputs are passed through environments, this stage accesses those values and sets them in the context. Setting them in the context allows accessing them directly through `inputs` in the mongoDB stage.

[The script can be found here](./extractEnvs.js)

## MongoDB Query

This stage uses the pre-built stage `mongoDBQuery` to query mongo DB with the converted request body and get the response back. Note that a few fields are passed as inputs in this stage.

These are:

- `mongoHost`: This is mapped from `MONGO_HOST` in envs above.
- `mongoCreds`: This is mapped from `MONGO_CREDS` in envs above.
- `mongoDb`: This is mapped from `MONGO_DB` in envs above.
- `mongoCollection`: This is mapped from `MONGO_COLLECTION` in envs above.