let AWS = require('aws-sdk');
let kinesis = new AWS.Kinesis();

/**
 * Ordering is not guaranteed 
 */
let pushToStreamBulk = function () {
    let num = 0
    let records = []
    for (num = 0; num < 10; num++) {
        let record = {
            Data: new Buffer('Producer Record-' + num),
            PartitionKey: 'Shard-' + num
        }
        records.push(record)
    }
    let params = {
        Records: records,
        StreamName: 'mvstream1'
    };
    kinesis.putRecords(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}
const MAX_DATA=5
/**
 * Ordering is guarnteed
 * @param {integer} recordNum 
 * @param {String} seqNum 
 */
let pushToStreamOrdered = function (recordNum, seqNum) {
    if (recordNum === MAX_DATA) return;
    let params = {
        Data: new Buffer('Producer Record-' + recordNum),
        PartitionKey: 'Shard-' + recordNum,
        StreamName: 'mvstream1',
        SequenceNumberForOrdering: seqNum

    };

    kinesis.putRecord(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data); //success
            pushToStreamOrdered(recordNum + 1, data.SequenceNumber)
        }
    });

}
pushToStreamOrdered(1,'1');