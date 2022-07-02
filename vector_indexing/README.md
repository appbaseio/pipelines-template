# Vector Indexing Pipeline

This pipeline demonstrates how an indexing pipeline can be created that supports indexing vectors automatically to be used in kNN while searching.

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/vector_indexing/pipeline_oneclick.yaml)

### [This is part of a bigger project and can be found here](https://github.com/appbaseio-apps/song-search)

## Before starting

There are some pre-requisites for this pipeline to work properly.

### Setup mapping

In order for the vector data to be indexed properly, the vector fields need to be setup. This can be done by hitting the `mapping` endpoint of ElasticSearch or OpenSearch.

Following request creates the mapping:

> NOTE that the `index`, `host` and `port` field need to be replaced with actual values

```sh
curl --location --request PUT 'https://{{host}}:{{port}}/{{index}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mappings": {
        "properties": {
            "lyric_vector": {
                "type": "dense_vector",
                "dims": 768,
                "index": true,
                "similarity": "cosine"
            }
        }
    }
}'
```

In the above request, one field is being created which will be used as vector fields during indexing process and will contain vector data.

This field is named as `lyric_vector`. Vector data of the `Lyric` field will be stored in this field.

### Bert Setup

This example pipeline uses [clip-as-service](https://clip-as-service.jina.ai/) in order to get vector encoding of the data. There should be an working URL of `clip-as-service` available in order for this pipeline ot be usable.

## Envs

Since the pipeline depends on Clip As Service, the URL needs to be passed as an environment variable.

- `BERT_URL`: It is expected to be passed through the github action yaml file that will use the `pipelines-action` to resolve the filed dynamically from a GitHub Secret.

They can be passed in the following way

```yaml
- name: Deploy Pipeline
  uses: appbaseio/pipelines-action@0.1.1
  with:
    url: ${{secrets.APPBASEIOURL}}
    file: "./vector_indexing/pipeline.yaml"
  env:
    BERT_URL: ${{ secrets.BERT_URL }}
```

Note that the `BERT_URL` is extracted from GitHub Secret. ([Read about GitHub Secrets here](https://docs.github.com/en/actions/security-guides/encrypted-secrets)):

[Read more about passing envs to `pipelines-action` here](https://github.com/appbaseio/pipelines-action#environments)

## Auth

This stage is just to make sure that only authorized requests go through the first stage. Since pipelines are invoked when a defined route is matched, the user needs to take control of the authorization part themselves.

For this, we expose a pre defined stage `authorization` that does everything that ReactiveSearch API did (under the hood).

> It is encouraged that this stage is added in all pipeline definitions as the first step.

## Add Body

This step uses a custom JS script to extract the field that needs to be vectorized and store it in the context as a JSON so that it can be used in the next step directly (next step is an `httpRequest` step).

[The source of this scrip can be found here](./addBody.js)

## Lyric Vector

This step uses the pre-built stage `httpRequest` to make a request to the Clip As Service endpoint and get the vector representation of the data. Since the step is set to be run `async`hronously, the response of the request will be stored in the context with the `id` of the field.

This means the response will be accessible through `context.lyric_vector`

## Merge Vector

Now that we have the response from Clip As Service, we also need to use the vector data and set it in the request body so that it gets indexed properly.

This is done through a custom JS script [that can be found here](./mergeVector.js).

## Index Data

Now that we have the final document body ready, we need to index the data into ElasticSearch. This can be done by using the pre-built stage `elasticsearchQuery`.
