# Query Rules

This pipeline explains how to use multiple pre-built stages to build a full-fledged search pipeline that does a lot of things like search relevancy, promoting results, replacing search term etc.

## Authorization

As usual, using `authorization` stage is a must in a public facing pipeline since this will ensure that only proper credentials has access to the endpoint. [Read more about authorization stage here](https://docs.appbase.io/docs/pipelines/how-to/handle-authorization-effectively).

## Search Relevancy

This stage provides support to apply settings to the ReactiveSearch API body. This is useful to apply default setting to fields like dataField which otherwise will throw an error on not being passed from the client.

## Replace Search Term

Just like the name suggests, this pre-built stage allows replacing the search term with something else. This can be useful if the term needs to be updated dynamically. For example, there can be a JS script stage that will take the user passed search term and modify it depending on some logic. Once the term is modified, it can be updated in the request body by using the `replaceSearchTerm` stage.

## Remove Words

This is another useful stage. Say there are words that need to be filtered out from a search query. This stage can be used in such a case to remove certain words that might effect the search results in an unexpected way.

## Replace Words

Similar to remove words, replace words allows replacing words with some other word. This can be useful in cases where certain words trigger a type of result that is otherwise not required.

## Add Filter

Add filter allows adding filter to the passed search query. This can be useful if certain filters need to be added dynamically based on some logic.

## Promote Results

Promote results, as the name suggests, supports promoting certain results. Think of this like sponsored results in something like a Google search, though there can be various reasons for promoting a result.

## Hide Results

Hide Results allows hiding certain results. There can be times when certain results needs to be hidden from the response. This can be achieved by using the `hideResults` stage.

## Custom Data

At times, there might be a need to add custom data to the response. Say the response will contain which node actually returned the 
