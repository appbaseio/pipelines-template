function handleRequest() {
  /* If the base64 image is not empty, get the caption for it */
  let finalQuery = "";

  let textValue = context.textValue;
  let isImagePassed = context.isImagePassed;

  if (isImagePassed) {
    /* Read the response body */
    const responseFromGcloud = JSON.parse(context.response.body);
    const caption = responseFromGcloud.predictions[0];
    finalQuery = caption;
  }

  if (textValue && textValue != "") {
    const separator = finalQuery.length != 0 ? " " : "";
    finalQuery += separator + textValue;
  }

  return {
    bingQuery: encodeURIComponent(finalQuery),
    rawBingQuery: finalQuery,
  };
}
