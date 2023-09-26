function handleRequest() {
  const queryTerm = context.envs.query;

  /* verifying that format of query is as expected before modifying */
  const requestBody = JSON.parse(context.request.body);
  if (!requestBody.query || requestBody.query.length == 0) {
    /* Update the queries with the defaultQuery */
    requestBody.query.forEach((queryEach, queryIndex) => {
      console.log("query id each: ", queryEach["id"]);
      if (
        queryEach.type == "suggestion" ||
        queryEach.type == "search" ||
        queryEach.type == undefined ||
        queryEach.type == "term"
      ) {
        requestBody.query[queryIndex] = injectDefaultQuery(queryEach);
      }
    });

    return {
      request: {
        body: JSON.stringify(requestBody),
      },
    };
  }

  /* If there is only one query and it is a suggestion type of
   * query, we need to inject a `result` id query where there will
   * be the defaultQuery and the current `search` query will react to
   * it.
   **/
  if (
    requestBody.query.length == 1 &&
    requestBody.query[0].type == "suggestion" &&
    requestBody.query[0].id == "search"
  ) {
    requestBody.query[0].id = "result";
    requestBody.query[0].execute = false;
    let resultQuery = {
      ...requestBody.query[0],
      id: "search",
      react: {
        and: ["result"],
      },
      execute: true,
    };
    requestBody.query.push(resultQuery);
  }

  /* Iterate through and if there is a suggestion or search query, update it
   * with the extra fields.
   **/
  console.log("query length: ", requestBody.query.length);
  requestBody.query.forEach((queryEach, queryIndex) => {
    console.log("query id: ", queryEach["id"]);

    /* If there is a term query of id result, change it to `search` type
     */
    if (queryEach.id == "result" && queryEach.type == "term") {
      queryEach.type = "search";
    }

    if (queryEach.type == "suggestion") {
      console.log("query id: ", queryEach["id"]);
      requestBody.query[queryIndex] = updateSuggestionsQuery(
        queryTerm,
        queryEach
      );
    } else if (queryEach.type == "search") {
      requestBody.query[queryIndex] = updateSearchQuery(queryTerm, queryEach);
      console.log(JSON.stringify(requestBody.query[queryIndex]));
    }

    /* Inject the defaultQuery
     *
     * If there is only one query, we don't want defaultQuery to
     * be injected since that will override the main query.
     */
    console.log(queryEach.id, ": ", queryEach.type);
    if (
      requestBody.query.length > 1 &&
      (queryEach.type == "suggestion" ||
        queryEach.type == "search" ||
        queryEach.type == undefined ||
        queryEach.type == "term")
    ) {
      requestBody.query[queryIndex] = injectDefaultQuery(queryEach);
    }
  });

  return {
    request: {
      body: JSON.stringify(requestBody),
    },
  };
}

function updateSuggestionsQuery(queryTerm, suggestionQuery) {
  if (!queryTerm) {
    queryTerm = "";
  }
  const queryLength = queryTerm.length;
  const dataFields = [
    {
      field: "longDescription",
      weight: 0.5,
    },
    {
      field: "name",
      weight: 3,
    },
    {
      field: "name.autosuggest",
      weight: 0.1,
    },
    {
      field: "name.search",
      weight: 0.01,
    },
    {
      field: "class",
      weight: 5,
    },
    {
      field: "class.search",
      weight: 1,
    },
  ];

  suggestionQuery["dataField"] = dataFields;

  suggestionQuery["queryFormat"] = "and";
  suggestionQuery["includeFields"] = [
    "class",
    "globalRank",
    "categoryRank",
    "name",
    "shortDescription",
    "longDescription",
    "salePrice",
    "image",
  ];
  suggestionQuery["distinctField"] = "class.keyword";
  suggestionQuery["distinctFieldConfig"] = {
    inner_hits: {
      name: "rel",
      size: 2,
      _source: [
        "class",
        "globalRank",
        "categoryRank",
        "name",
        "shortDescription",
        "longDescription",
        "salePrice",
        "image",
      ],
    },
  };

  console.log("query id: ", suggestionQuery["id"]);

  /* Responding to the user intent based on the query length */
  if (queryLength <= 4) {
    // user is perhaps checking out the search
    suggestionQuery.enablePopularSuggestions = true;
    suggestionQuery.enableFeaturedSuggestions = true;
    suggestionQuery.enableRecentSuggestions = true;
  } else if (queryLength >= 5 && queryLength <= 9) {
    // user is looking for something specific
    suggestionQuery.enablePopularSuggestions = false;
    suggestionQuery.enableFeaturedSuggestions = false;
    suggestionQuery.enableRecentSuggestions = true;
  } else if (queryLength >= 10) {
    // user is definitely looking for something specific
    suggestionQuery.enableRecentSuggestions = false;
    suggestionQuery.enablePopularSuggestions = false;
    suggestionQuery.enableFeaturedSuggestions = false;
  }

  return suggestionQuery;
}

function updateSearchQuery(queryTerm, searchQuery) {
  const dataFields = [
    {
      field: "longDescription",
      weight: 1,
    },
    {
      field: "name",
      weight: 3,
    },
    {
      field: "name.autosuggest",
      weight: 0.2,
    },
    {
      field: "name.delimiter",
      weight: 1,
    },
    {
      field: "name.search",
      weight: 0.1,
    },
    {
      field: "class",
      weight: 5,
    },
    {
      field: "class.search",
      weight: 1,
    },
  ];

  searchQuery["dataField"] = dataFields;

  searchQuery["queryFormat"] = "and";
  searchQuery["includeFields"] = [
    "class",
    "globalRank",
    "categoryRank",
    "name",
    "shortDescription",
    "longDescription",
    "salePrice",
    "image",
  ];
  searchQuery["distinctField"] = "class.keyword";
  searchQuery["distinctFieldConfig"] = {
    inner_hits: {
      name: "rel",
      size: 2,
      _source: [
        "class",
        "globalRank",
        "categoryRank",
        "name",
        "shortDescription",
        "longDescription",
        "salePrice",
        "image",
      ],
    },
  };

  /*searchQuery['sortField'] = ['globalRank', 'categoryRank'];
    searchQuery['sortBy'] = 'asc'; */
  console.log("query is: ", searchQuery["id"]);
  console.log("datafields are: ", JSON.stringify(searchQuery["dataField"]));

  if (!queryTerm) {
    return searchQuery;
  }

  const queryLength = queryTerm.length;
  if (!queryTerm || queryLength === 0) {
    return searchQuery;
  }

  if (
    queryLength >= 20 &&
    queryTerm.split(" ").length >= 4 &&
    queryTerm[queryTerm.length - 1] == "?"
  ) {
    searchQuery["enableAI"] = true;
    searchQuery["execute"] = true;
  }

  return searchQuery;
}

function injectDefaultQuery(query) {
  /* Use exists query to boost score of results that contain
    either globalRank or categoryRank */
  console.log("existing default query: ", JSON.stringify(query.defaultQuery));
  if (
    (!query.defaultQuery || JSON.stringify(query.defaultQuery) == "{}") &&
    query.execute
  ) {
    query.defaultQuery = {
      query: {
        bool: {
          must_not: [
            {
              match: {
                class: "ACCY",
              },
            },
            {
              match: {
                class: "APPLECARE",
              },
            },
            {
              match: {
                class: "ACCESSORIES",
              },
            },
            {
              match: {
                class: "ACCESS.",
              },
            },
            {
              match: {
                class: "IPAD MONTHLY",
              },
            },
            {
              match: {
                class: "SVC FEE",
              },
            },
          ],
          should: [
            {
              range: {
                salePrice: {
                  gte: 499,
                  boost: 5,
                },
              },
            },
            {
              range: {
                salePrice: {
                  gte: 299,
                  boost: 5,
                },
              },
            },
            {
              range: {
                salePrice: {
                  gte: 99,
                  boost: 4,
                },
              },
            },
            {
              range: {
                categoryRank: {
                  lte: 10,
                  boost: 2,
                },
              },
            },
            {
              range: {
                categoryRank: {
                  lte: 5,
                  boost: 2,
                },
              },
            },
            {
              range: {
                categoryRank: {
                  lte: 1,
                  boost: 1,
                },
              },
            },
            {
              range: {
                globalRank: {
                  lte: 10,
                  boost: 5,
                },
              },
            },
            {
              range: {
                salePrice: {
                  gte: 50,
                  boost: 0.01,
                },
              },
            },
          ],
        },
      },
    };
  }

  return query;
}
