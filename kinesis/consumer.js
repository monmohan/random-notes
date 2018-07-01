console.log('Loading function');
/**
 * Handle array of kinesis records
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
exports.handler = function(event, context, callback) {
    //console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        var payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
    });
    callback(null, "message");
};