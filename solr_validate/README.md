# Solr Validate

This pipeline shows how to provide a `/validate` endpoint for Solr backend and return the built query in response instead of making the search request.

## Auth

This stage handles authorization using the [authorization](https://docs.appbase.io/docs/pipelines/how-to/handle-authorization-effectively/) pre-built stage to make sure only valid credentials are allowed access to the endpoint.

This is a must-have stage for any user-facing public pipeline.

## ReactiveSearch

This stage uses the `reactivesearchQuery` stage to convert the request body to it's Solr equivalent. Note that the `inputs.backend` value is passed as `solr` in order to indicate that the request should be converted to its Solr equivalent.

## Generate the Query

This stage uses some custom JS to generate the query based on the converted request body. It uses a custom JS script to build a response to be returned to the user and replaces that in the context.

[This script can be found here](./generateQuery.js)