function handleRequest() {
    const body = JSON.parse(context.request.body);
    const metadata = body.metadata;
    if (metadata == undefined || metadata.app == undefined || metadata.profile == undefined) {
        throw Error('`metadata.app` and`metadata.profile`are required fields!');
    } return {
        fusionApp: metadata.app, fusionProfile: metadata.profile
    }
}