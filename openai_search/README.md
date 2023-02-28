# kNN Search (with OpenAI)

This pipeline shows how to make a vector search endpoint.

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/openai_search/pipeline_oneclick.yaml)

### [This is part of a bigger project and can be found here](https://github.com/appbaseio-apps/song-search)

## Before starting

There are some pre-requisites for this pipeline to work properly.

### Setup mapping

Mapping should be setup accordingly in order for the search request to work and all documents should have the `vector_data` field that contains a valid vector with the same dimensions as the one being searched with.

This field is named as `vector_data`. Vector data of the `Summary` and `Text` fields will be stored in this field.

## Envs

Since the pipeline depends on OpenAI's API, the API Key needs to be passed as an environment variable.

- `OPENAI_API_KEY`: It is expected to be passed through the github action yaml file that will use the `pipelines-action` to resolve the filed dynamically from a GitHub Secret.

They can be passed in the following way

```yaml
- name: Deploy Pipeline
  uses: appbaseio/pipelines-action@0.1.1
  with:
    url: ${{secrets.APPBASEIOURL}}
    file: "./openai_indexing/pipeline.yaml"
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

Note that the `OPENAI_API_KEY` is extracted from GitHub Secret. ([Read about GitHub Secrets here](https://docs.github.com/en/actions/security-guides/encrypted-secrets)):

[Read more about passing envs to `pipelines-action` here](https://github.com/appbaseio/pipelines-action#environments)

## Authorize User

This stage is just to make sure that only authorized requests go through the first stage. Since pipelines are invoked when a defined route is matched, the user needs to take control of the authorization part themselves.

For this, we expose a pre defined stage `authorization` that does everything that ReactiveSearch API did (under the hood).

> It is encouraged that this stage is added in all pipeline definitions as the first step.

## Fetch Embeddings

Since we have the user authorized, we will need to fetch the embeddings for the passed query. For this we will use the pre-built stage `openAIEmbeddings`. This stage will iterate the request body, go through each query object, find the ones that have the `vectorDataField` specified and accordingly fetch the vector representation for that value. This vector data is then set at `queryVector` field in that object.

## ReactiveSearch Query

This stage translates the request body into it's equivalent ElasticSearch body so that it can be sent to Opensearch/Elasticsearch.

## ElasticSearch Query

This stage uses the `elastcisearchQuery` pre-built stage to hit ES to get the search response. This is just a typical ES stage.