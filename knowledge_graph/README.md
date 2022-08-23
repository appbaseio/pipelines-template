# Knowledge Graph

This pipeline fetches data from Google's Knowledge graph and merges it with the ElasticSearch response data.

[Deploy this pipeline with just a click](https://dashboard.reactivesearch.io/deploy?template=https://raw.githubusercontent.com/appbaseio/pipelines-template/master/knowledge_graph/pipeline_oneclick.json)

## Envs

Following values need to be passed in the step `env` key while using the `pipelines-action`.

- `KNOWLEDGE_GRAPH_API_KEY`: Credentials to hit ElasticSearch to save the search.

They can be passed in the following way

```yaml
- name: Deploy Pipeline
  uses: appbaseio/pipelines-action@0.1.1
  with:
    url: ${{secrets.APPBASEIOURL}}
    file: "./knowledge_graph/pipeline.yaml"
  env:
    KNOWLEDGE_GRAPH_API_KEY: ${{ secrets.KNOWLEDGE_GRAPH_API_KEY }}
```

Note that the `KNOWLEDGE_GRAPH_API_KEY` is extracted from GitHub Secret. ([Read about GitHub Secrets here](https://docs.github.com/en/actions/security-guides/encrypted-secrets)):

[Read more about passing envs to `pipelines-action` here](https://github.com/appbaseio/pipelines-action#environments)

---

This pipeline builds on top of the basic pipeline example. It dives deeper into the possibilities of the pipelines feature. In this pipeline, we are utilizing Google's Knowledge Graph by hitting them (with credentials passed by the user using the `envs` key) and merging the response with the fetched ElasticSearch response.

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

## ReactiveSearchQuery

This stage, again, uses a predefined stage `reactivesearchQuery`. This stage _translates_ the passed reactivesearch query into an ElasticSearch query.

## Google Knowledge Graph

This is the stage where we finally hit the knowledge graph API to get some data. The script [can be found here](./googleKnowledgeGraph.js)

The script utilizes the `context` field of pipelines which consists of `envs` (passed from the pipeline file) along with the `request` and `response` bodies. From `envs`, this script is accessing the `query` field and the `knowledge graph API key`.

> NOTE: query is populated automatically

These envs are passed in the pipeline file in the following way:

```yaml
envs:
  someOtherEnvKey: envKeyValue
  knowledgeGraphAPIKey: ${{secrets.KNOWLEDGE_GRAPH_API_KEY}}
```

In the above, the `secrets.KNOWLEDGE_GRAPH_API_KEY` will be resolved to the stored value in GitHub Secrets. [Read more about storing secrets on GitHub](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

### Async

Another important thing to note here is that the stage is defined with `async` field set to `true`. This just means that the script needs to be run asynchronously. The stage will wait for the script to complete or timeout (whichever happens first).

This field is important because the function defined in the script for this stage is defined with the `async` keyword and utilizes `await` inside the function defintion.

## Elastic Search Query

This stage just uses the predefined `elasticsearchQuery` stage to hit Elastic Search with the _translated_ query (translation done in the `ReactiveSearchQuery` stage). This stage also uses the `async` field since it is internally making an API call (to ES) so the response needs to be _await_'ed.

## Merge Response

This is the final stage that defines a custom JS script that takes both the ElasticSearch response (from the previous stage) and the knowledge graph response (from the `Google Knowledge Graph` stage) and merges them together.

This stage utilizes the `depends` key to make sure that it is not executed before the either of `elastic search` or `google knowledge graph` stage. This is important because this stage needs the response from both stages so it will _wait_ till it's dependencies are _resolved_.

The script [can be found here](./merge.js). The script is pretty straightforward, it extracts the required data by using the `context` and then updates the `response.body` by merging both the responses into one object.
