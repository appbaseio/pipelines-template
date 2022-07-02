function handleRequest() {
    const requestBody = JSON.parse(context.request.body);

    return {
        "lyricBody": getBody(requestBody.Lyric)
    }
}

function getBody(data) {
    return JSON.stringify({
        data: [{ text: data }],
        execEndpoint: "/"
    })
}