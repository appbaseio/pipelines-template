function handleRequest() {
  const queryTerm = context.envs.query || "";

  /* verifying that format of query is as expected before modifying */
  const requestBody = JSON.parse(context.request.body);

  /* Iterate through and if there is a suggestion or search query, update it
   * with the extra fields.
   **/
  requestBody.query.forEach((queryEach, queryIndex) => {
    /* If the query type is term and is called `result`, change type
     * to term
     */
    if (queryEach.type == "term" && queryEach.id == "result") {
      queryEach.type = "search";
    }

    if (queryEach.type == "suggestion") {
      requestBody.query[queryIndex] = updateSuggestionsQuery(
        queryTerm,
        queryEach
      );
    } else if (queryEach.type == "search" || !queryEach.type) {
      requestBody.query[queryIndex] = updateSearchQuery(queryTerm, queryEach);
    }
  });

  return {
    request: {
      body: JSON.stringify(requestBody),
    },
  };
}

function updateSuggestionsQuery(queryTerm, suggestionQuery) {
  const queryLength = queryTerm.length;
  const dataFields = [
    {
      field: "title",
      weight: 6,
    },
    {
      field: "heading",
      weight: 4,
    },
    {
      field: "pageURL",
      weight: 4,
    },
    {
      field: "url",
      weight: 4,
    },
    {
      field: "tokens.keyword",
      weight: 2,
    },
    {
      field: "category",
      weight: 2,
    },
  ];

  suggestionQuery["dataField"] = dataFields;
  suggestionQuery["queryFormat"] = "and";
  suggestionQuery["distinctField"] = "category.keyword";

  /* Responding to the user intent based on the query length */
  if (queryLength <= 6) {
    // user is perhaps checking out the search
    suggestionQuery.enablePopularSuggestions = false;
    suggestionQuery.enableFeaturedSuggestions = false;
    suggestionQuery.enableRecentSuggestions = false;
    suggestionQuery.enableDocumentSuggestions = true;
    /* suggestionQuery.indexSuggestionsConfig = { size: 5 }; */
    /* suggestionQuery.documentSuggestionsConfig = {
         *    sectionLabel: 'Recently Viewed',
         *};
         *suggestionQuery.indexSuggestionsConfig = {
        //    sectionLabel: 'Search Results',
        //};
        */
    suggestionQuery.showDistinctSuggestions = true;
  } else if (queryLength >= 7 && queryLength <= 12) {
    // user is looking for something specific
    suggestionQuery.enablePopularSuggestions = false;
    suggestionQuery.enableFeaturedSuggestions = false;
    suggestionQuery.enableRecentSuggestions = true;
    /* suggestionQuery.indexSuggestionsConfig = { size: 5 }; */
    suggestionQuery.showDistinctSuggestions = true;
    /* suggestionQuery.documentSuggestionsConfig = {
         *    sectionLabel: 'Recently Viewed',
         *};
         *suggestionQuery.indexSuggestionsConfig = {
        //    sectionLabel: 'Search Results',
        //};
        */
  } else if (queryLength >= 13) {
    // user is definitely looking for something specific
    suggestionQuery.enableRecentSuggestions = false;
    suggestionQuery.enablePopularSuggestions = false;
    suggestionQuery.enableFeaturedSuggestions = false;
    /* suggestionQuery.indexSuggestionsConfig = { size: 5 }; */
    suggestionQuery.showDistinctSuggestions = true;
    /*suggestionQuery.indexSuggestionsConfig = {
        //    sectionLabel: 'Search Results',
        //};
        */
  }

  return suggestionQuery;
}

function updateSearchQuery(queryTerm, searchQuery) {
  const queryLength = queryTerm.length;
  const dataFields = [
    {
      field: "title",
      weight: 6,
    },
    {
      field: "heading",
      weight: 4,
    },
    {
      field: "pageURL",
      weight: 4,
    },
    {
      field: "url",
      weight: 4,
    },
    {
      field: "tokens.keyword",
      weight: 2,
    },
    {
      field: "category",
      weight: 2,
    },
  ];

  searchQuery["dataField"] = dataFields;
  searchQuery["queryFormat"] = "and";
  searchQuery["distinctField"] = "category.keyword";

  if (
    queryLength >= 20 &&
    queryTerm.split(" ").length >= 4 &&
    queryTerm[queryTerm.length - 1] == "?"
  ) {
    searchQuery["enableAI"] = true;
  }

  return searchQuery;
}
