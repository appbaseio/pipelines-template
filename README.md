# ReactiveSearch Pipelines Templates

This repo acts as a get started template repo for the end user that just wants to get their hands dirty with ReactiveSearch Pipelines.

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
