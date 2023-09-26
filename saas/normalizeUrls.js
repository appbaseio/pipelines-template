function handleRequest() {
  /* Iterate through the hits and normalize the URL field
   * in them
   **/
  const responseBody = JSON.parse(context.response.body);

  let resultHits = responseBody.result?.hits?.hits;
  if (resultHits) {
    resultHits.forEach((resultHit, resultIndex) => {
      if (resultHit.url && resultHit._source.url.startsWith("http")) return;

      /* For blogs, category will be the url */
      if (resultHit._source.category.startsWith("http")) {
        resultHit._source.url = resultHit._source.category;
        resultHits[resultIndex] = resultHit;
        return;
      }

      resultHit._source.url =
        "https://docs.reactivesearch.io" + resultHit._source.pageURL;
      resultHits[resultIndex] = resultHit;
    });
    responseBody.result.hits.hits = resultHits;
  }

  let searchHits = responseBody.search?.hits?.hits;
  if (searchHits) {
    searchHits.forEach((searchHit, searchIndex) => {
      if (searchHit.url && searchHit._source.url.startsWith("http")) return;

      searchHit._source.url =
        "https://docs.reactivesearch.io" + searchHit._source.pageURL;
      searchHits[searchIndex] = searchHit;
    });
    responseBody.search.hits.hits = searchHits;
  }

  return {
    response: {
      body: JSON.stringify(responseBody),
    },
  };
}
