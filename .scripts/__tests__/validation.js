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
        await validate.validatePipeline(pipeline.pipelinePath, pipeline.validatePath);
    }
})