# ReactiveSearch Pipelines Templates

This repo acts as a get started template repo for the end user that just wants to get their hands dirty with ReactiveSearch Pipelines.

## Table of Contents

Following pipeline examples are provided in this template.

To use any of the pipeline provided, just the `file` path needs to be changed in the action yaml: `./github/workflow/action.yaml`

1. [Basic Pipeline](https://github.com/appbaseio/pipelines-template/tree/master/basic) (default)
2. [Knowledge Graph](https://github.com/appbaseio/pipelines-template/tree/master/knowledge_graph)
3. [Saved Search](https://github.com/appbaseio/pipelines-template/tree/master/saved_search)

### Prerequisites

- Appbase.io URL will have to be saved as a secret in GitHub secrets with the keyword `APPBASEIOURL`. This URL is required by the action to deploy the pipeline.