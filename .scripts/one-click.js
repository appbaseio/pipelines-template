/**
 * Take care of generating one-click json files from
 * the yaml defined. This script will also take care of
 * resolving dependencies present in the same directory and
 * accordingly take care of converting everything into a single
 * JSON file that can be used as a one-click.json file.
 */

import * as fs from "fs";
import * as yaml from "js-yaml";


function handleOneClickGeneration() {
    /**
     * Handle everything regarding the one-click file generation.
     * 
     * Take care of parsing the yaml pipeline and converting it
     * into a single JSON. Every stage will be iterated and if
     * `scriptRef` is present in any, it will be replaced with a
     * `script` instead.
     * 
     * The script should get the pipeline file path as the first
     * argument or will end up erroring out.
     */

    // Remove the first two elements since those are generic values
    // anyway.
    const argsPassed = process.argv.slice(2);

    if (argsPassed.length < 1) {
        console.error("usage: one-click.js <path to pipeline file>")
        return
    }

    var pathToPipeline = argsPassed[0];

    // Check if the file exists and throw error if it doesn't.
    if (!fs.existsSync(pipelinePath)) {
        throw new Error("invalid pipeline path passed: does not exist!")
    }

    // The pipeline file will be accepted as a JSON as well. If it is
    // an YAML, that will be converted to a JSON and then worked on.
    fileExtension = pathToPipeline.toLowerCase().split(".").pop();

    var parsedPipelineContent = null;

    switch (fileExtension) {
        case "json":
            // Parse the file since it exists.
            let fileContent = fs.readFileSync(pipelinePath);
            parsedPipelineContent = JSON.parse(fileContent);
            break;
        case "yaml":
            // Parse the yaml into JSON
            parsedPipelineContent = yaml.load(fs.readFileSync(pipelinePath, "utf-8"));
            break;
        default:
            throw new Error("invalid file passed: only `.json` and `.yaml` files are accepted as pipelines.")
    }

    // Iterate the pipeline stages since no other thing requires parsing
    // and then resolve any scriptRefs if present.
}