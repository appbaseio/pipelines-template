async function getLocationFromIP(ip) {
    /* Get location from the passed IP address */
    const response = await fetch(`http://ip-api.com/json/${ip}`);

    if (response.status != 200) return "";

    /* Parse the response */
    const jsonResponse = JSON.parse(response);
    
    if (jsonResponse.status != "success") return "";

    /* Return the string in `city, state, country` format */
    return [jsonResponse.city, jsonResponse.regionName, jsonResponse.country].join(", ");
}

async function handleRequest() {
    const requestBody = JSON.parse(context.request.body);
    const passedIP = requestBody.ip;

    if (passedIP == undefined || passedIP == null || passedIP == "") return {};

    /* Get the location from IP */
    const location = await getLocationFromIP(passedIP);
    return {
        extractedLocation: location
    };
}