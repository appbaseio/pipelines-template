function handleRequest() {
    const reqBody = JSON.parse(context.request.body);
    return {
        ...context, request: {
            ...context.request, body: JSON.stringify({
                ...reqBody,
                query: [...reqBody.query, { id: 'search2' }]
            })
        }
    };
}