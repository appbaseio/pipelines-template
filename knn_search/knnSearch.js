async function handleRequest() {
    const requestBody = JSON.parse(context.request.body)

    if (requestBody.query == undefined || requestBody.query.length < 1) return {}

    var queryValue = undefined;
    requestBody.query.every(q => {
        if (q.value != undefined) {
            queryValue = q.value;
            return false;
        }
        return true;
    })

    const includeFields = requestBody.query[0].includeFields
    const ids = requestBody.query.map(q => q.id);

    const esBodyToPass = {
        _source: {
            includes: includeFields
        }
    }
    var esPathToPass = `/${context.envs.index}/_knn_search`;

    if (queryValue != undefined) {
        const vectoredValue = await getVectorForData(queryValue);
        esBodyToPass.knn = {
            field: "lyric_vector",
            query_vector: vectoredValue,
            k: 10,
            num_candidates: 10000
        }
    } else {
        esPathToPass = `/${context.envs.index}/_search`
        esBodyToPass.query = {
            match_all: {}
        }
    }

    return {
        esPath: esPathToPass,
        esBody: esBodyToPass,
        queryIds: ids
    }
}


async function getVectorForData(data) {
    const url = `${context.envs.bertURL}/post`;


    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: [{ text: data }],
            execEndpoint: "/"
        })
    });

    const jsonResponse = JSON.parse(response);
    return jsonResponse.data[0].embedding;
}