function handleRequest() {
  const responseBody = JSON.parse(context.response.body);
  const values = responseBody.value;
  const matchedId = context.matchedId;

  /* The values will be an array of objects that we will convert
   * to RS equivalent
   */
  const hitsAsRS = [];
  for (let i = 0; i < values.length; i++) {
    const hitEach = values[i];
    hitsAsRS.push({
      _type: "_doc",
      _id: hitEach.imageId,
      _source: hitEach,
    });
  }

  const hitsAsMap = {
    querySearchedFor: context.rawBingQuery,
    hits: {
      total: {
        value: hitsAsRS.length,
      },
      hits: hitsAsRS,
    },
  };

  const RSResponse = {};
  RSResponse["SearchResult"] = hitsAsMap;

  return {
    response: {
      body: JSON.stringify(RSResponse),
    },
  };
}
