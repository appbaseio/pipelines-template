const queriesInput = `You have access to a search API that returns recent news articles.
Generate an array of search queries that are relevant to this question.
Use a variation of related keywords for the queries, trying to be as general as possible.
Include as many queries as you can think of, including and excluding terms.
For example, include queries like ['keyword_1 keyword_2', 'keyword_1', 'keyword_2'].
Be creative. Return a maximum of 5 queries and chose to represent all of the user question in these.

User question: {USER_INPUT}

Format: {{"queries": ["query_1", "query_2", "query_3"]}}
`;

function handleRequest() {
  const query = context.envs.query;

  if (!query) {
    throw Error("`value` is required to search!");
  }

  const chatInputWithQuery = queriesInput.replace("{USER_INPUT}", query);
  return {
    queryGenBody: JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: chatInputWithQuery,
        },
      ],
    }),
  };
}
