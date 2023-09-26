function handleRequest() {
  /**
   * Read the response and generate the question for ChatGPT
   * that we will send.
   *
   * We need to make sure that the token count is within limit
   * and we keep 500 tokens for the answer.
   */
  const responseBody = JSON.parse(context.response.body);
  const query = context.envs.query;

  if (!query) {
    throw Error("`value` cannot be empty!");
  }

  if (!responseBody.OlympicComponent?.hits?.hits) {
    throw Error("got 0 hits for the search query!");
  }

  const hits = responseBody.OlympicComponent.hits.hits.slice(0, 10);

  const intro =
    'Use the below articles on the 2022 Winter Olympics to answer the subsequent question. If the answer cannot be found in the articles, write "I could not find an answer."\n';
  const question = `\n\nQuestion: ${query}`;
  let message = intro;

  for (let i = 0; i < hits.length; i++) {
    const text = hits[i]._source.text;
    const nextArticle = `\n\nWikipedia article section:\n"""\n${text}\n"""`;

    /* Add check to make sure that next_article doesn't overload the token
     * budget else break
     */
    if (isTokenOutOfBudget(message + nextArticle + question)) {
      break;
    }

    message += nextArticle;
  }

  const finalQuestion = message + question;

  const chatGPTBody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You answer questions about the 2022 Winter Olympics.",
      },
      { role: "user", content: finalQuestion },
    ],
    temperature: 0,
  };

  return {
    chatGPTQuestion: JSON.stringify(chatGPTBody),
    ogResponse: JSON.stringify(responseBody),
  };
}

function countTokens(text) {
  const tokens = text.split(/\s+/);
  return tokens.length * 3;
}

function isTokenOutOfBudget(text, budget = 4096 - 500 - 25) {
  /**
   * The token budget is the allowed token limit for the input
   * we are generating. Default is 4096 (allowed tokens for gpt-3.5-turbo)
   * - 500 (expected token usage for the answer) - 25 (margin of error).
   *
   * We are keeping the margin of error because the token calculation
   * we are doing for the text is not 100% accurate as we are not using
   * the tiktoken library.
   */
  const tokens = countTokens(text);
  return tokens > budget;
}
