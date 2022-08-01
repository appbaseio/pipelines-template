function handleRequest() {
    const requestBody = JSON.parse(context.request.body);

    const fieldToEncode = context.envs.VECTOR_TO_ENCODE

    return {
        "lyricBody": getBody(requestBody[fieldToEncode])
    }
}

function getBody(data) {
    return JSON.stringify({
        data: [{ text: data }],
        execEndpoint: "/"
    })
}