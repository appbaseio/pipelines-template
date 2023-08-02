function handleRequest() {
    const requestBody = JSON.parse(context.request.body);
  
    if (requestBody.query == null) {
      throw error("query is a required field!");
    }
}