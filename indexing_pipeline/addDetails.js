function handleRequest() {
    const requestBody = JSON.parse(context.request.body)
    return {
        request: {
            ...context.request,
            body: JSON.stringify({
                ...requestBody,
                location: context.extractedLocation
            })
        }
    }
}