exports.handler = (event, context, callback) => {

    let responseBody = {
        "type": "OU",
    };
    responseBody.urn=event.pathParameters.proxy
    console.log(responseBody)

    let response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
    callback(null, response);
};