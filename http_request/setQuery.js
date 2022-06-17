function handleRequest() {
    try {
        return {
            query: JSON.parse(context.request.body).query[0].value
        }
    } catch (e) { throw e }
}