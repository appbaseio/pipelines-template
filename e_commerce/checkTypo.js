function handleRequest() {
  const queryTerm = context.envs.query;

  if (queryTerm && queryTerm.length < 5) {
    return {};
  }

  const globalRankWeight = 0.2;
  const categoryRankWeight = 0.5;

  const responseBody = JSON.parse(context.response.body);
  if (
    responseBody.search?.hits?.hits?.length != 0 &&
    responseBody.result?.hits?.hits?.length != 0
  ) {
    /* Seems like we have hits, we can order the results
     * based on the score.
     */
    const results = responseBody.result?.hits?.hits;
    if (results) {
      results.forEach((hitEach, hitIndex) => {
        if (!hitEach._source.categoryRank && !hitEach._source.globalRank) {
          hitEach._source.categoryRank = 10;
        }

        let isGlobalRank = false;

        if (hitEach._source.globalRank) {
          const ogScore = hitEach._score;
          results[hitIndex]._score =
            ogScore - globalRankWeight * hitEach._source.globalRank;
          isGlobalRank = true;
        }

        if (hitEach._source.categoryRank && !isGlobalRank) {
          const ogScore = hitEach._score;
          results[hitIndex]._score =
            ogScore - categoryRankWeight * hitEach._source.categoryRank;
        }
      });

      /* Sort the results in desc of score */
      results.sort((a, b) => {
        return b._score - a._score;
      });
      responseBody.result.hits.hits = results;
      return {
        response: {
          body: JSON.stringify(responseBody),
        },
      };
    }

    return {};
  }

  /* Extract the RS body */
  const rsBody = JSON.parse(context.envs["ORIGINAL_RS_BODY"]);

  let fuzziness = 1;
  if (queryTerm.length >= 5 && queryTerm.length <= 9) {
    fuzziness = 1;
  } else {
    fuzziness = 2;
  }

  rsBody.query?.forEach((queryEach, queryIndex) => {
    queryEach.fuzziness = fuzziness;
    rsBody.query[queryIndex] = queryEach;
  });

  return {
    request: {
      body: JSON.stringify(rsBody),
    },
    envs: {
      research: true,
      ...context.envs,
    },
  };
}
