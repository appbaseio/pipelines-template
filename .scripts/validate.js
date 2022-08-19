/**
 * Take care of validating the pipeline passed based
 * on the inputs passed along with it.
 * 
 * The pipeline one-click file needs to be passed to
 * this script as the first argument and the second argument
 * should be the validation details for that particular pipeline.
 */

function validatePipeline() {
    /**
     * Validate the pipeline and take care of everything
     * else linked to that.
     */
    const argsPassed = process.argv.slice(2);

    if (argsPassed.length < 2) {
        console.error("usage: validate.js <path to pipeline file> <path to validation file>")
        return
    }

    pathToPipeline = argsPassed[0];
    pathToValidateFile = argsPassed[1];

    // TODO: Parse the pipeline one-click JSON file to get it ready for sending the request.

    // TODO: Parse the configuration to extract the APPBASE_URL
}