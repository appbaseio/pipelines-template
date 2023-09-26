function handleRequest() {
  const gptResponse = JSON.parse(context.response.body);
  const ogResponse = JSON.parse(context.ogResponse);

  ogResponse["OlympicComponent"]["AIAnswer"] = gptResponse;
  return {
    response: {
      body: JSON.stringify(ogResponse),
    },
  };
}
