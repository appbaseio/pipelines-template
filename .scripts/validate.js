/**
 * Take care of validating the pipeline passed based
 * on the inputs passed along with it.
 * 
 * The pipeline one-click file needs to be passed to
 * this script as the first argument and the second argument
 * should be the validation details for that particular pipeline.
 * 
 * NOTE: This file will never run on its own and will just contain
 * functions that can be used by external tests defined.
 */
import fetch from "node-fetch";
import * as fs from "fs";
import { default as FormData } from "form-data";
const { test, expect } = global;

import config from "./config.js";

async function checkUpstreamActive(appbaseURL, appbaseCREDS) {
    /**
     * Check whether or not the APPBASE_URL passed
     * is active by hitting the `/arc/_health` endpoint.
     * 
     * @param {string} appbaseURL APPBASE_URL to verify whether or not
     * it is active.
     * 
     * @param {string} appbaseCREDS Credentials in the form of username:password
     * 
     * @returns {Boolean} Indicates whether or not upstream is active
     */
    const URLtoHit = `${appbaseURL}/arc/_health`
    const credentials = Buffer.from(appbaseCREDS).toString("base64");

    const response = await fetch(URLtoHit, {
        headers: {
            "Authorization": `basic ${credentials}`
        }
    });

    return response.status == 200;
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
    if (pipelinePath.toLowerCase().split(".").pop() != "json") {
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
    if (validatorPath.toLowerCase().split(".").pop() != "json") {
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


async function hitValidatePipeline(pipelineBody, request, appbaseURL, appbaseCREDS) {
    /**
     * Hit the `/_pipeline/validate` endpoint of the passed upstream
     * with the pipeline content and the `request` as a form
     * value.
     * 
     * @param {string} pipelineBody Pipeline body as stringified JSON
     * @param {Object} request Request with `headers` and `body` nested inside.
     * @param {string} appbaseURL APPBASE_URL to hit to validate the pipeline.
     * @param {string} appbaseCREDS Credentials to hit appbase URL
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
        body: formToSend,
        headers: {
            "Authorization": `Basic ${Buffer.from(appbaseCREDS).toString("base64")}`
        }
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

    // Verify the status code based on the response.
    test("response status code match", () => {
        expect(validateResponse.status).toBe(validatorObject.matchCriteriaStatus);
    });

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

    // Verify the response object against the response passed in
    // the validator object.
    test("response body match", () => {
        expect(validatorObject.response).toMatchObject(responseObject);
    })
}


async function validatePipeline(pathToPipeline, pathToValidateFile) {
    /**
     * Validate the pipeline and take care of everything
     * else linked to that.
     * 
     * @param {string} pathToPipeline path to the pipeline file
     * @param {string} pathToValidateFile path to the validate file
     */
    // Parse the configuration to extract the APPBASE_URL
    var appbaseURL = config.APPBASE_URL
    var appbaseCREDS = config.CREDENTIALS

    // Verify that upstream is active
    var isUpstreamActive = await checkUpstreamActive(appbaseURL, appbaseCREDS)
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

    const validateResponse = await hitValidatePipeline(pipelineContent, validatorObj.request, appbaseURL, appbaseCREDS);

    // Check the response code of the response and accordingly verify based on the details
    // specified in the validator object passed.
    verifyResponse(validatorObj, validateResponse);
}


(() => {
    console.log("This file is not made to run on the CLI directly. Functions defined here can be imported to run on test suites!");
})()