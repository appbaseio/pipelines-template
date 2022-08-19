/**
 * Take care of validating the pipeline passed based
 * on the inputs passed along with it.
 * 
 * The pipeline one-click file needs to be passed to
 * this script as the first argument and the second argument
 * should be the validation details for that particular pipeline.
 */
import fetch from "node-fetch";

import { config } from "./config.js";

async function checkUpstreamActive(appbaseURL) {
    /**
     * Check whether or not the APPBASE_URL passed
     * is active by hitting the `/arc/_health` endpoint.
     * 
     * @param {string} appbaseURL APPBASE_URL to verify whether or not
     * it is active.
     */
    URLtoHit = `${appbaseURL}/arc/_health`

    response = await fetch(URLtoHit)

    return response.statusCode == 200;
}

async function validatePipeline() {
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

    // Parse the configuration to extract the APPBASE_URL
    appbaseURL = config.APPBASE_URL

    // Verify that upstream is active
    isUpstreamActive = await checkUpstreamActive(appbaseURL)
    if (!isUpstreamActive) {
        console.error("upstream is not active, `/arc/_health` returned a non OK status code!")
        return
    }

    console.log("Upstream is active: status received is OK!")

    // TODO: Parse the pipeline one-click JSON file to get it ready for sending the request.


}