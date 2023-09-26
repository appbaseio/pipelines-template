function handleRequest() {
  const responseBody = JSON.parse(context.customResponse);

  /* Read the AI Answer response */
  const answerBody = JSON.parse(context.answerCall);
  const answerMessage = answerBody.choices[0].message.content;

  responseBody["answer"] = answerMessage;

  return {
    response: {
      ...context.response,
      body: JSON.stringify(responseBody),
    },
  };
}
