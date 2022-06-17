function handleRequest() {
    return {
        response: {
            ...context.response, body:
                JSON.stringify({
                    ...JSON.parse(context.response.body), data_muse: context.data_muse_api
                })
        }
    }
}