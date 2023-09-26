async function handleRequest() {
  const responseBody = JSON.parse(context.response.body);

  let queriesParsed = [];
  try {
    const queriesReturned = responseBody.choices[0].message.content;
    queriesParsed = JSON.parse(queriesReturned)["queries"];
  } catch (e) {
    throw Error("Error while parsing ChatGPT response: " + e);
  }

  /* Using the parsed queries, make calls to News API */

  const totalCalls = queriesParsed.length;
  const newsAPIKey = context.envs.NEWS_API_KEY;
  console.log(totalCalls);

  if (!newsAPIKey) {
    throw Error("News API key needs to be defined!");
  }

  let topTwoEach = await Promise.all(
    queriesParsed.map(async (query) => {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&apiKey=${newsAPIKey}&pageSize=2&sortBy=relevancy`
      );
      const jsonResponse = await res.json();

      /* Prepare the top 2 results for each query */
      return jsonResponse.articles.map((a) => {
        a["query"] = query;
        return a;
      });
    })
  );

  /* Merge the articles */
  let finalArticles = [];
  topTwoEach.forEach((r) => {
    finalArticles.push(...r);
  });

  const urlKeyObj = {};

  finalArticles.forEach((a) => {
    if (a.title == null) return;

    urlKeyObj[a.url] = a;
  });

  topTwoEach = finalArticles;

  return {
    queriesParsed: JSON.stringify(queriesParsed),
    topTwoEach: JSON.stringify(topTwoEach),
  };
}
