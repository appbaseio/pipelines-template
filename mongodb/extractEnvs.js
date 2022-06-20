function handleRequest() {
    return {
        mongoHost: context.envs.MONGO_HOST,
        mongoCreds: context.envs.MONGO_CREDS,
        mongoDb: context.envs.MONGO_DB,
        mongoCollection: context.envs.MONGO_COLLECTION
    }
}