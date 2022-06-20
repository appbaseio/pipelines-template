function handleRequest() {
    const requestBody = JSON.parse(context.request.body)
    const lyricVector = JSON.parse(context["lyric_vector"])

    return {
        request: {
            ...context.request,
            body: JSON.stringify({
                ...requestBody,
                "lyric_vector": lyricVector.data[0].embedding
            })
        }
    }
}