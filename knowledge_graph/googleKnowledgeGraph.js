async function handleRequest() {
    try {
        const URL = `https://kgsearch.googleapis.com/v1/entities:search?query=${context.envs.query}&key=${context.envs.knowledgeGraphAPIKey}&limit=1&indent=True`;
        const responseBody = await fetch(URL); const response = JSON.parse(responseBody);
        return { knowledge_graph: response }
    } catch (e) { } return context;
}