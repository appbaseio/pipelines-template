function handleRequest() {
  const queryTerm = context.envs.query;

  if (queryTerm && queryTerm.length < 5) {
    return {};
  }

  const responseBody = JSON.parse(context.response.body);
  if (
    responseBody.search?.hits?.hits?.length != 0 &&
    responseBody.result?.hits?.hits?.length != 0
  ) {
    return {};
  }

  /* Extract the RS body */
  const rsBody = JSON.parse(context.envs["ORIGINAL_RS_BODY"]);

  let fuzziness = 1;
  if (queryTerm && queryTerm.length >= 5 && queryTerm.length <= 9) {
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
