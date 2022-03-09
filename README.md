# ReactiveSearch Pipelines Templates

This repo acts as a get started template repo for the end user that just wants to get their hands dirty with ReactiveSearch Pipelines.

## Table of Contents

Following pipeline examples are provided in this template.

To use any of the pipeline provided, just the `file` path needs to be changed in the action yaml: `./github/workflow/action.yaml`

1. [Basic Pipeline](#basic-pipeline) (default)
2. [Knowledge Graph](#knowledge-graph)
3. [Saved Search](#saved-search)

### Prerequisites

- Appbase.io URL will have to be saved as a secret in GitHub secrets with the keyword `APPBASEIOURL`. This URL is required by the action to deploy the pipeline.

### Basic Pipeline

This is a basic pipeline that mocks the reactivesearch endpoint by defining a few steps:

In this pipeline file, we are passing a `scriptRef` for the [modifyRequest.js](./basic/modifyRequest.js) file which is automatically resolved by the pipeline action.

