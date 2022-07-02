function handleRequest() {
    return {
        "fusionHost": context.envs.FUSION_HOST,
        "fusionCreds": context.envs.FUSION_CREDS
    }
}