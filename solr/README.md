# Solr

This pipeline shows how to use the pipeline functionality with Solr (or Fusion) to build a search relevant search pipeline.

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/solr/pipeline_oneclick.json)

## Envs

The following environment variables are required for the pipeline to work properly.

- `SOLR_CREDS`
- `SOLR_HOST`

### Solr Creds

This is the Solr credentials that will allow access to the Solr host. This should be in the format of `username:password`.

This is expected to be present as a GitHub Secret with the key `SOLR_CREDS` in order for it to automatically resolve during pipeline creation using the [pipeline-action](https://github.com/marketplace/actions/reactivesearch-pipelines).

### Solr Host

This is the host URL for connecting to the Solr instance. This should also contain the port if the host is just an IP address.

Following are some of valid options for the host value:

- `1.2.2.3:6764`
- `solr-instance.private-domain.com`

This is also expected to be present as a GitHub Secret with the key `SOLR_HOST` in order for it to automatically resolve during pipeline creation using the [pipeline-action](https://github.com/marketplace/actions/reactivesearch-pipelines).

## Authorization

As usual, the authorization stage is added in order to make sure that only valid credentials are allowed access and other  kind of requests are denied access.

## Extract app and profile

In case of solr, a few inputs are required in order for the stage to work properly. This includes the `profile` and the `app` value. These values are expected to be passed dynamically in this pipeline.

The values should be passed in the request body in the `metadata` object. It should be of the following type:

```json
{
    "query": [],
    "metadata": {
        "app": "reactivesearch",
        "profile": "reactivesearch"
    }
}
```

These values are then extracted and put in the context through a custom script. This script, written in JS, takes care of throwing an error in case the values are not present in the request body. [It can be found here](./extractMetadata.js)

## Extract Solr Host and Credentials

Since the solr host and credentials are passed as environment values, this stage uses a JS script to extract these values and save them in the context.

The `SOLR_CREDS` value is extracted and stored in `context.solrCreds` field.
The `SOLR_HOST` value is extracted and stored in the `context.solrHost` field.

The [script can be found here](./setEnvironments.js)

## ReactiveSearch Query

This stage takes the ReactiveSearch body and converts it into it's Solr equivalent. It is important to note that the `backend` is set as `solr` in this stage.

This tells the stage that the body should be converted to Solr equivalent.

## Solr Query

The final stage where the converted value is taken and the response is extracted. In this stage, the pre-built stage `solrQuery` is used along with inputs extracted in the stages before in order to make the request complete and the response converted and returned.