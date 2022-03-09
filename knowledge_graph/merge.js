function handleRequest() {
    const esResponse = JSON.parse(context.elasticsearchQuery);
    const knowledgeGraph = context['knowledge_graph']; return {
        ...context, response:
            { ...context.response, body: JSON.stringify({ ...esResponse, knowledgeGraph }) }
    }
}