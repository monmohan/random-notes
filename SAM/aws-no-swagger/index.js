exports.handler = async (event, context) => {

    var responseBody = {
        "key1": "async data"
    };

    var response = {
        "statusCode": 500,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
    return response;
};