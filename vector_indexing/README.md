# Vector Indexing Pipeline

This pipeline demonstrates how an indexing pipeline can be created that supports indexing vectors automatically to be used in kNN while searching.

## Before starting

There are some pre-requisites for this pipeline to work properly.

### Setup mapping

In order for the vector data to be indexed properly, the vector fields need to be setup. This can be done by hitting the `mapping` endpoint of ElasticSearch or OpenSearch.

Following request creates the mapping:

> NOTE that the `index`, `host` and `port` field need to be replaced with actual values

```sh
curl --location --request PUT 'https://{{host}}:{{port}}/{{index}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mappings": {
        "properties": {
            "lyric_vector": {
                "type": "dense_vector",
                "dims": 768,
                "index": true,
                "similarity": "cosine"
            }
        }
    }
}'
```

In the above request, one field is being created which will be used as vector fields during indexing process and will contain vector data.

This field is named as `lyric_vector`. Vector data of the `Lyric` field will be stored in this field.
