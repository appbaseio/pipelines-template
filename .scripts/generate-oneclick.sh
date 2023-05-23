#!/usr/bin/sh
PIPELINE_PATHS=("basic" "cache_analytics" "http_request" "knn_search" "knowledge_graph" "mongodb" "query_rules" "saved_search" "solr" "solr_validate" "vector_indexing")

for i in "${PIPELINE_PATHS[@]}"
do
   yarn one-click "../$i/pipeline.yaml"
done
