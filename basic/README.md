# Basic Pipeline

This is a basic pipeline that mocks the reactivesearch endpoint by defining a few stages

As explained in the main README file, a pipeline consists of a few stages. The stages defined in this pipeline are:

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

## Query

This stage, again, uses a predefined stage `reactivesearchQuery`. This stage _translates_ the passed reactivesearch query into an ElasticSearch query.

## ES Query

This stage uses the `elasticsearchQuery` to hit ES with the _translated_ query from the previous stage.

### Async

This stage definition also includes an `async` field which is set to `true`. This is because this stage will make internal requests (hitting ElasticSearch) so the execution will not return until this stage resolves (or times out).

> Another important use of the `async` field is, if some stage depends on another stage where the latter is making some async calls, the former stage will be executed only after the latter (the dependency) stage is executed.
