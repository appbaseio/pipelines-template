/**
 * Take care of running the validator related tests.
 */

const validate = require("../validate");

const PIPELINES_TO_VALIDATE = [
    {
        "pipelinePath": "../basic/pipeline_oneclick.json",
        "validatePath": "../basic/validate.json"
    },
    {
        "pipelinePath": "../cache_analytics/pipeline_oneclick.json",
        "validatePath": "../cache_analytics/validate.json"
    }
]


test("validate all pipelines", async () => {
    for (const pipeline of PIPELINES_TO_VALIDATE) {
        const objectToVerify = await validate.validatePipeline(pipeline.pipelinePath, pipeline.validatePath);

        const expectedObject = {
            "status": objectToVerify.status.expect,
            "response": objectToVerify.response.expect,
        };
        const receivedObject = {
            "status": objectToVerify.status.toBe,
            "response": objectToVerify.response.toBe
        };

        if (Object.keys(objectToVerify).includes("responseCode")) {
            expectedObject["responseCode"] = objectToVerify.responseCode.expect;
            receivedObject["responseCode"] = objectToVerify.responseCode.toBe;
        }

        // Verify the status and response
        expect(JSON.stringify(expectedObject)).toBe(JSON.stringify(receivedObject));
    }
})