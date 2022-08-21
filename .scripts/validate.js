/**
 * Take care of validating the pipeline passed based
 * on the inputs passed along with it.
 * 
 * The pipeline one-click file needs to be passed to
 * this script as the first argument and the second argument
 * should be the validation details for that particular pipeline.
 */
import fetch from "node-fetch";
const fs = require('fs');
var FormData = require("form-data");

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


function parseValidator(validatorPath) {
    /**
     * Parse the validator file and return the parsed contents
     * properly.
     * 
     * This function will verify that the file actually exists
     * before the file is imported.
     * 
     * @param {string} validatorPath Path to the validator file
     * 
     * @returns {Object} parsed validator object with details about
     * validating the pipeline
     */

    // Check if the extension is JSON
    if (validatorPath.toLower().split(".").pop() != "json") {
        throw Error("invalid pipeline path passed: file is non JSON")
    }

    if (!fs.existsSync(validatorPath)) {
        throw Error("invalid validator path passed: does not exist!")
    }

    // Parse the file since it exists.
    let fileContent = fs.readFileSync(validatorPath);
    let parsedJSONContent = JSON.parse(fileContent);
    return parsedJSONContent;
}


async function hitValidatePipeline(pipelineBody, request, appbaseURL) {
    /**
     * Hit the `/_pipeline/validate` endpoint of the passed upstream
     * with the pipeline content and the `request` as a form
     * value.
     * 
     * @param {string} pipelineBody Pipeline body as stringified JSON
     * @param {Object} request Request with `headers` and `body` nested inside.
     * @param {string} appbaseURL APPBASE_URL to hit to validate the pipeline.
     * 
     * @returns {Response} Response received from the validate endpoint.
     */
    const formToSend = new FormData();

    // Add the pipeline body
    formToSend.append("pipeline", pipelineBody);

    // Add the request body as a stringified JSON
    formToSend.append("request", JSON.stringify(request));

    const validateResponse = await fetch(`${appbaseURL}/_pipeline/validate`, {
        method: "POST",
        body: formToSend
    });

    return validateResponse;
}


function verifyResponse(validatorObject, validateResponse) {
    /**
     * Take care of verifying the response based on the user
     * specification as passed in the validation file.
     * 
     * @param {Object} validatorObject Validator object to get user
     * provided validation details from.
     * @param {Response} validateResponse Response received from the
     * validate endpoint.
     */

    // If the `matchCriteriaStatus` is not passed, set it to 200.
    if (!Object.keys(validatorObject).includes("matchCriteriaStatus") || validatorObject.matchCriteriaStatus == "") {
        // Add the status as 200.
        validatorObject.matchCriteriaStatus = 200;
    }

    // TODO: Verify the status code based on the response.

    // Parse the response into an object
    responseObject = JSON.parse(validateResponse)

    // If `matchCriteriaPath` is passed, then we need to extract the value
    // for that key from the response and verify that, else use the whole response
    // JSON as a whole.
    if (!Object.keys(validatorObject).includes("matchCriteriaPath") || validatorObject.matchCriteriaPath == "") {
        // Extract the value
        // We need to split the passed key using `dot` and use the keys dynamically
        // to extract the name.
        keySplitted = validatorObject.matchCriteriaPath.split(".")

        eachValue = responseObject
        keySplitted.forEach(key => {
            if (eachValue == undefined) {
                // Throw an error
                throw Error(`error while extracting the value for 'matchCriteriaPath'. 'undefined' found at: ${key}`);
            }

            eachValue = eachValue[key];
        });

        // Set the `eachValue` as the responseObject
        responseObject = eachValue
    }

    // TODO: Verify the response object against the response passed in
    // the validator object.

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

    // Parse the validator file
    var validatorObj = null
    try {
        validatorObj = parseValidator(pathToValidateFile)
    } catch (err) {
        console.error("error while parsing validator file: ", err)
        return
    }

    if (validatorObj == null) {
        console.error("no content present in the passed validator file!")
        return
    }

    console.log("validator file parsed successfully!");

    const validateResponse = await hitValidatePipeline(pipelineContent, validatorObj.request, appbaseURL);

    // TODO: Check the response code of the response and accordingly verify based on the details
    // specified in the validator object passed.
}