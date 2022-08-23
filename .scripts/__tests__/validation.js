/**
 * Take care of running the validator related tests.
 */

const validate = require("../validate");

const PIPELINES_TO_VALIDATE = [
    {
        "pipelinePath": "../basic/pipeline_oneclick.json",
        "validatePath": "../basic/validate.json"
    }
]


test("validate all pipelines", async () => {
    for (const pipeline of PIPELINES_TO_VALIDATE) {
        const objectToVerify = await validate.validatePipeline(pipeline.pipelinePath, pipeline.validatePath);

        // Verify the status
        expect(objectToVerify.status.expect).toBe(objectToVerify.status.toBe);

        // Verify the response
        expect(objectToVerify.response.expect).toBe(objectToVerify.response.toBe);
    }
})