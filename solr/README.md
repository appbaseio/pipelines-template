# Fusion

This pipeline shows how to use the pipeline functionality with Fusion (or Solr) to build a search relevant search pipeline.

## Envs

The following environment variables are required for the pipeline to work properly.

- `FUSION_CREDS`
- `FUSION_HOST`

### Fusion Creds

This is the fusion credentials that will allow access to the Fusion host. This should be in the format of `username:password`.

This is expected to be present as a GitHub Secret with the key `FUSION_CREDS` in order for it to automatically resolve during pipeline creation using the [pipeline-action](https://github.com/marketplace/actions/reactivesearch-pipelines).

### Fusion Host

This is the host URL for connecting to the Fusion instance. This should also contain the port if the host is just an IP address.

Following are some of valid options for the host value:

- `1.2.2.3:6764`
- `fusion-instance.private-domain.com`

This is also expected to be present as a GitHub Secret with the key `FUSION_HOST` in order for it to automatically resolve during pipeline creation using the [pipeline-action](https://github.com/marketplace/actions/reactivesearch-pipelines).