function handleRequest() {
    const esResponse = JSON.parse(context.response.body);

    const builtResponse = {};

    context.queryIds.forEach(qId => {
        builtResponse[qId] = esResponse;
    })

    return {
        response: {
            ...context.response,
            body: JSON.stringify(builtResponse)
        }
    }
}