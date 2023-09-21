function handleRequest() {
  /* Parse the request body and read the value and the image of
   * the first search type of object.
   */
  const requestBody = JSON.parse(context.request.body);
  const valueFromEnvs = context.envs.query;

  if (!requestBody.query || !requestBody.query.length) {
    throw Error("`query` is a required paramter in the body!");
  }

  let matchedId = "";
  let textValue = "";
  let base64Img = "";
  for (let i = 0; i < requestBody.query.length; i++) {
    const queryEach = requestBody.query[i];
    if (queryEach.type && queryEach.type != "search") continue;

    matchedId = queryEach.id;
    if (queryEach.value) {
      textValue = queryEach.value;
    }

    if (queryEach.imageValue) {
      base64Img = parseBase64Part(queryEach.imageValue);
    }
  }

  if (textValue == "" && valueFromEnvs) {
    textValue = valueFromEnvs;
  }

  /* Remove any special characters from the textValue */
  if (textValue && textValue != "") {
    textValue = textValue.replaceAll("\n", "");
  }

  if (matchedId == "") {
    /* There are no queries with search type */
    throw Error("at least one query with search type is required!");
  }

  /* Make sure that one of base64 or value was passed */
  if (base64Img == "" && textValue == "") {
    throw Error("one of `value` or `imageValue` is required!");
  }

  let gcloudBody = "";
  if (base64Img != "") {
    /* Build the body for gcloud call */
    gcloudBody = buildGcloudBodyForCaption(base64Img);
  }

  return {
    matchedId: matchedId,
    textValue: textValue,
    isImagePassed: base64Img != "",
    captionBody: gcloudBody,
  };
}

function buildGcloudBodyForCaption(base64ImageStr) {
  /**
   * Build the body for the gcloud API call to get the
   * caption for the image.
   */
  return JSON.stringify({
    instances: [
      {
        image: {
          bytesBase64Encoded: base64ImageStr,
        },
      },
    ],
    parameters: {
      sampleCount: 1,
      language: "en",
    },
  });
}

function parseBase64Part(base64Img) {
  /**
   * Parse the base64 part of the image string passed
   * and return that.
   */
  const parts = base64Img.split(",");
  if (parts.length !== 2) {
    throw Error("invalid input for base64 image");
  }

  return parts[1];
}
