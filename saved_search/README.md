# Saved Search

This pipeline is similar to the basic pipeline with an extra step that saves the search to an user preferred index

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/saved_search/pipeline_oneclick.json)

## Envs

Following values need to be passed in the step `env` key while using the `pipelines-action`.

- `SAVED_SEARCH_URL`: Index to save the search to

They can be passed in the following way

```yaml
- name: Deploy Pipeline
  uses: appbaseio/pipelines-action@0.1.1
  with:
    url: ${{secrets.APPBASEIOURL}}
    file: "./saved_search/pipeline.yaml"
  env:
    SAVED_SEARCH_URL: ${{ secrets.SAVED_SEARCH_URL }}
```

Note that the `SAVED_SEARCH_URL` is extracted from GitHub Secret. ([Read about GitHub Secrets here](https://docs.github.com/en/actions/security-guides/encrypted-secrets)):

[Read more about passing envs to `pipelines-action` here](https://github.com/appbaseio/pipelines-action#environments)

---

This pipeline just adds one extra stage on top of the `basic` pipeline. This stage is a custom stage that runs a defined JS script. This script _saves_ the search request to an user preferred index (passed using the `envs.saved_search_index`)

Following stages are defined in this pipeline

## Auth

This stage is just to make sure that only authorised requests go through the first stage. Since pipelines are invoked when a defined route is matched, the user needs to take control of the authorization part themselves.

For this, we expose a pre defined stage `authorization` that does everything that ReactiveSearch API did (under the hood).

> It is encouraged that this stage is added in all pipeline definitions as the first step.

## Modify Request

This stage is a _custom_ stage defined to explain how custom stages work. Here, a JS script is executed when the stage is executed. This script [can be found here](./modifyRequest.js).

> It is assumed that the request body will contain a `query` field which will be an array of objects.

This script will add a new object into the `query` field which is an array of objects. This object will be:

```json
{
  "id": "search2"
}
```

## Save Search

This stage defines the custom JS script [that can be found here](./saveSearch.js) to save the search to the `saved_search_index` using the `saved_search_credentials` passed by the user.

This script hits the ES API and saves the `request.body` by utilizing the `context` passed by the stage execution.

### Async

The stage defines an `async` field that is set to `true`. This field indicates that this stage needs to be _awaited_ to be resolved or timeout (whichever happens first).

## Reactive Search Query

This stage, again, uses a predefined stage `reactivesearchQuery`. This stage _translates_ the passed reactivesearch query into an ElasticSearch query.

## ES Query

This stage uses the `elasticsearchQuery` to hit ES with the _translated_ query from the previous stage.

Just like the save search stage, this stage also uses the `async` field to make sure that the response is awaited. This is important because this stage hits an external API (ES) to get the response and then returns it.
