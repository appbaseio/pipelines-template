async function handleRequest() {
    try {
        const headersPassed = JSON.parse(context.envs.save_search_HEADERS);
        const res = await fetch(context.envs.save_search_URL,
            {
                method: context.envs.save_search_METHOD, body: context.request.body, headers: headersPassed
            });
    } catch (e) { console.log('error', e); } return {};
}