# kNN Search

This pipeline shows how to make a vector search endpoint.

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/knn_search/pipeline_oneclick.yaml)

### [This is part of a bigger project and can be found here](https://github.com/appbaseio-apps/song-search)

## Before starting

There are some pre-requisites for this pipeline to work properly.

### Setup mapping

Mapping should be setup accordingly in order for the search request to work and all documents should have the `lyric_vector` field that contains a valid vector with the same dimensions as the one being searched with.

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

[Read more about passing envs to `pipelines-action` here](https://github.com/appbaseio/pipelines-action#environments).

## Authorize User

This stage is just to make sure that only authorized requests go through the first stage. Since pipelines are invoked when a defined route is matched, the user needs to take control of the authorization part themselves.

For this, we expose a pre defined stage `authorization` that does everything that ReactiveSearch API did (under the hood).

> It is encouraged that this stage is added in all pipeline definitions as the first step.

## Knn Vectors

This stage uses a custom JS script that hits Clip As Service to get the vector representation of the search term. This is important because we will need to use vector data to search against the stored vector data.

This is essentially getting a vector representation of the query string. [The file can be found here](./knnSearch.js)

## Determine Search

This step just gets the vector body from the above step and adds it to the `context.body` field. This is a required step because the above step is `async` so it cannot make changes to the `context.body` field and thus an extra step is required.

[The script can be found here](./determineSearch.js)

## ES Query

This stage uses the `elastcisearchQuery` pre-built stage to hit ES to get the search response. This is just a typical ES stage.

## Update Response

This is just a quality of life script. This search pipeline just searched based on the first query passed to the request body. This means all other queries are ignored.

This custom script takes the response body from the first query and adds it to all the other query IDs passed. Just a quality of life patch to make ReactiveSearch frontend work seamlessly.