function handleRequest() {
    const requestBody = JSON.parse(context.request.body)
    const lyricVector = JSON.parse(context["lyric_vector"])
    const vectorFieldName = context.envs.VECTOR_FIELD_NAME

    return {
        request: {
            ...context.request,
            body: JSON.stringify({
                ...requestBody,
                vectorFieldName: lyricVector.data[0].embedding
            })
        }
    }
}