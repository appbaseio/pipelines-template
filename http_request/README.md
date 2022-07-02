# Http Request

This pipeline shows the usage of `httpRequest` pre-built stage by utilizing in the pipeline.

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/http_request/pipeline_oneclick.yaml)

## Set Query

This stage merely uses a JS script that [can be found here](./setQuery.js) to extract the user passed query and set it in the context against the key `query`. This is useful in the following stages.

Note that this uses the `query.value` of the first query present in the `query` array in the request body.

## Data Muse API

This stage uses the `httpRequest` pre-built stage to hit DataMuse and extract details using the `query` passed by the user.

In here the `context.query` value will be used in the `inputs` field. Since `inputs` also support dynamic data, the `query` can be passed to the request directly.

Following is an example of how it's done:

```yml
- id: data_muse_api
  description: To get data from data muse api in asynchronous manner
  use: httpRequest
  async: true
  inputs:
    url: https://api.datamuse.com/sug
    params:
      s: "{{query}}"
    continueOnError: false
```

> NOTE that the response body will be stored in the `context.data_muse_api` key. The `id` of the stage is used as a key for storing the response from the `http request`.

## Reactive Search

This is just a reactivesearch stage that is converting the query to the ElasticSearch equivalent to make the request.

## ElasticSearch

This stage is using the converted query to hit ES and get the final response. The response is then stored in the `context.response.body` field.

## Merge Response

Since now we have `context.response.body` as well as the `context.data_muse_api` body, we will merge the two responses to return the final response to the user. This is defined in a script [that can be found here](./merge.js).

It is just updating the `context.response.body` by merging the two responses.