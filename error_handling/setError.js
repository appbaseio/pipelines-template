function handleRequest() {
    return {
      response: {
        body: JSON.stringify({"message": "error while executing reactivesearch"}),
        code: 500
      }
    }
}