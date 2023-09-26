const ANSWER_PROMPT = `
Generate an answer to the user's question based on the given search results. 
TOP_RESULTS: {results}
USER_QUESTION: {USER_QUESTION}

Include as much information as possible in the answer. Reference the relevant search result urls as markdown links.
`;

async function handleRequest() {
  const openAIKey = context.envs.openAIConfig.open_ai_key;
  const queriesParsed = JSON.parse(context.queriesParsed);
  const topTwoEach = JSON.parse(context.topTwoEach);

  const bodyToReturn = {
    results: {
      hits: topTwoEach.slice(0, 10),
      count: topTwoEach.length,
    },
    queries: {
      count: queriesParsed.length,
      hits: queriesParsed,
    },
    resultsByQuery: topTwoEach,
  };

  const formattedResults = topTwoEach.slice(0, 10).map((a) => {
    return JSON.stringify({
      title: a["title"],
      description: a["description"],
      url: a["url"],
    });
  });

  const query = context.envs.query;

  let promptWithFormat = ANSWER_PROMPT.replace(
    "{results}",
    formattedResults.toString()
  );
  promptWithFormat = promptWithFormat.replace("{USER_QUESTION}", query);

  /* Make the answer call */
  const answerResponse = await makeAnswerCall(
    openAIKey,
    JSON.stringify({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: promptWithFormat,
        },
      ],
    })
  );

  return {
    customResponse: JSON.stringify(bodyToReturn),
    answerCall: JSON.stringify(answerResponse),
  };
}

async function makeAnswerCall(apiKey, body) {
  const answerResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: body,
    }
  );
  const response = await answerResponse.json();
  return response;
}
