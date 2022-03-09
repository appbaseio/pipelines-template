async function handleRequest() {
    try {
        const res = await fetch(`http://${context.envs.origin}/${context.envs.saved_search_index}/_doc`,
            {
                method: 'POST', body: context.request.body, headers: {
                    'Content - Type': 'application/ json',
                    'Authorization': `Basic ${btoa(context.envs.saved_search_credentials)}`
                }
            });
    } catch (e) { console.log('error', e); } return {};
}