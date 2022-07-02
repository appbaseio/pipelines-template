function handleRequest() {
    const queries = JSON.parse(context.request.body);
    var generatedURIs = {}; for (var key of Object.keys(queries)) {
        const queryEach = queries[key];
        const generatedEach = {
            'original': JSON.parse(queryEach['_original'])
        };
        delete queryEach['_original'];
        generatedURIs[key] = generatedEach;
        generatedEach['built'] = '?' + Object.keys(queryEach).reduce(function (a, k) {
            a.push(k + '=' +
                encodeURIComponent(queryEach[k]));
            return a
        }, []).join('&')
    }
    return {
        response:
            { body: JSON.stringify(generatedURIs), code: 200 }
    }
}