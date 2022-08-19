/**
 * Take care of validating the pipeline passed based
 * on the inputs passed along with it.
 * 
 * The pipeline one-click file needs to be passed to
 * this script as the first argument and the second argument
 * should be the validation details for that particular pipeline.
 */
import fetch from "node-fetch";
const fs = require('fs')

import { config } from "./config.js";

async function checkUpstreamActive(appbaseURL) {
    /**
     * Check whether or not the APPBASE_URL passed
     * is active by hitting the `/arc/_health` endpoint.
     * 
     * @param {string} appbaseURL APPBASE_URL to verify whether or not
     * it is active.
     * 
     * @returns {Boolean} Indicates whether or not upstream is active
     */
    URLtoHit = `${appbaseURL}/arc/_health`

    response = await fetch(URLtoHit)

    return response.statusCode == 200;
}


function parsePipelineFile(pipelinePath) {
    /**
     * Parse the pipeline file based on the passed path.
     * 
     * This function will also check whether or not the file
     * is present and accordingly throw errors.
     * 
     * Assumption is that the file will be a JSON file since
     * the upstream endpoint expects JSON content as well.
     * 
     * @param {string} pipelinePath Path to the pipeline file
     * 
     * @returns {string} Contents of the pipeline file
     */

    // Check if the extension is JSON
    if (pipelinePath.toLower().split(".").pop() != "json") {
        throw Error("invalid pipeline path passed: file is non JSON")
    }

    if (!fs.existsSync(pipelinePath)) {
        throw Error("invalid pipeline path passed: does not exist!")
    }

    // Parse the file since it exists.
    let fileContent = fs.readFileSync(pipelinePath);
    let parsedJSONContent = JSON.parse(fileContent);
    return JSON.stringify(parsedJSONContent);
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

    // Parse the pipeline one-click JSON file to get it ready for sending the request.
    var pipelineContent = null
    try {
        pipelineContent = parsePipelineFile(pathToPipeline);
    } catch (err) {
        console.error("error while parsing pipeline file: ", err)
        return
    }

    if (pipelineContent == null) {
        console.error("no content present in the passed pipeline file!")
        return
    }

    console.log("pipeline file parsed successfully!")

    // TODO: Parse the validator file

}