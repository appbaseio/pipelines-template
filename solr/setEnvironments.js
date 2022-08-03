function handleRequest() {
    return {
        "solrHost": context.envs.SOLR_HOST,
        "solrCreds": context.envs.SOLR_CREDS
    }
}