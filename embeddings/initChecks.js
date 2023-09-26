// your function handler should always be named as handleRequest()
function handleRequest() {
  /**
   * Check if the incoming request is a question.
   */

  const requestBody = JSON.parse(context.request.body);
  const searchComponent = requestBody.query.filter(
    (q) => q.id == "OlympicComponent"
  );

  if (!requestBody.settings) {
    requestBody.settings = {};
  }

  requestBody.settings.backend = "opensearch";

  /* If type is not search, we do not continue */
  if (
    !searchComponent ||
    searchComponent.length == 0 ||
    searchComponent[0].type != "search"
  ) {
    return {
      skipAnswer: true,
      request: {
        body: JSON.stringify(requestBody),
      },
    };
  }

  // Inject the vectorDataField in the request body
  for (let i = 0; i < requestBody.query.length; i++) {
    const queryEach = requestBody.query[i];
    if (queryEach.type == "search" && queryEach.id == "OlympicComponent") {
      requestBody.query[i].vectorDataField = "embedding";
      requestBody.query[i].excludeFields = ["embedding"];
    }
  }

  return {
    request: {
      body: JSON.stringify(requestBody),
    },
  };
}
