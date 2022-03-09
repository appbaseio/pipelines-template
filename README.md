# ReactiveSearch Pipelines Templates

This repo acts as a _get started_ template repo for the end user that just wants to get their hands dirty with ReactiveSearch Pipelines.

## What are Pipelines?

**TL;DR**

- Pipelines lets the user define how a route, when hit, should behave.
- Pipelines consist of a set of stages executed in an order (as defined by the user).
- Pipelines allows using predefined stages using the `use` keyword and custom stages using a `.js` file passed by either the `script` or `scriptRef` field.

---

Pipelines are user defined files that gets invoked by one or more routes (defined during creation). When invoked, these pipelines just follow a set of stages (in an user defined order). Pipelines gives the end user to craft custom endpoints according to their needs on top of the _pre-built_ stages provided.

Pipeline Stages consists of two types:

### Pre Defined Stages

These are stages defined by the API and these can be directly utilized in a certain stage by using the `use` keyword.

For eg: If we want to use a predefined stage that to enforce passing credentials in the pipeline route invocation, we can use the `authorization` stage in the following way:

```yaml
- id: Authorize the request
  uses: authorization
```

### Custom Stages

Custom stages can also be executed in the pipeline by defining them in the stage. A custom stage should be **JavaScript** code that will get executed. This _chunk_ of `JS` code can be passed in a stage using either the `script` or the `scriptRef` key.

- The `script` key is a string which consists of the JS code. This is essentially **_inline_** JS code.
- The `scriptRef` key is a path to a `.js` file that contains the JS code.

For eg: If we want to use a custom stage that `console.log()`'s the request body passed by the user, we can do that in the following way:

```js
console.log(JSON.stringify(context.request.body));
```

> NOTE: We are stringify'ing the body because an object is just printed as `object Object`

Let's say below file is named `log.js` and is in the same directory that the `pipeline.yaml` file is in, we can define a stage in the following way:

```yaml
- id: Console Log request body
  scriptRef: "log.js"
```

OR, if we want to pass the JS _inline_, we can do that in the following way:

```yaml
- id: Console Log request body
  script: "console.log(JSON.stringify(context.request.body));"
```

## Table of Contents

Following pipeline examples are provided in this template.

To use any of the pipeline provided, just the `file` path needs to be changed in the action yaml: `./github/workflow/action.yaml`

| Name                                                                                           | Description                                                                                                                                                                                           | File Path                         |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [Basic Pipeline](https://github.com/appbaseio/pipelines-template/tree/master/basic)            | This pipeline mocks reactivesearch by defining three basic steps, `authorization`, `reactivesearchQuery` and `elasticsearchQuery` along with a custom modify request script that modifies the request | `./basic/pipeline.yaml`           |
| [Knowledge Graph](https://github.com/appbaseio/pipelines-template/tree/master/knowledge_graph) | This pipeline fetches data from Google's Knowledge graph and merges it with the ES response data                                                                                                      | `./knowledge_graph/pipeline.yaml` |
| [Saved Search](https://github.com/appbaseio/pipelines-template/tree/master/saved_search)       | This pipeline is similar to the basic pipeline with an extra step that saves the search to an user preferred index                                                                                    | `./saved_search/pipeline.yaml`    |

### Prerequisites

- Appbase.io URL will have to be saved as a secret in GitHub secrets with the keyword `APPBASEIOURL`. This URL is required by the action to deploy the pipeline. [Read more about setting GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
