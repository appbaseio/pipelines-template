# Cache Analytics

This pipeline shows how to use the pre-built stages provided to cache the responses as well as use analytics

## Authorization

Authorization stage takes care of verifying the entity trying to access the endpoint by making sure the credentials are valid. This should always be the first stage in a public facing pipeline.

## Search Relevancy

Search relevancy is an important thing to have responses that are actually relevant to the search term entered by the user. This `searchRelevancy` stage allows setting various preferences for the different type of suggestions.

## Use Cache

Caching can be an essential thing for quick responses for a search term. The `useCache` stage exposes the cache plugin of ReactiveSearch to allow caching the requests in order to get better response times for search results.

## Record Analytics

Record analytics is a stage that allows recording the analytics of the current request and store it safely in an internal index that can be queried on later to get insights about user behavior of search results and how the user interacts after seeing a search result.