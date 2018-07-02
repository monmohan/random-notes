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
        if (err) console.log(err, err.stack); 
        else console.log(data);           
    });
}
const MAX_DATA=5

/**
 * Ordering is guarnteed
 * @param {integer} recordNum 
 * @param {String} seqNum 
 */
let pushToStreamOrdered = function (recordNum, seqNum, shardId) {
    if (recordNum === MAX_DATA) return;
    
    let params = {
        Data: new Buffer('Producer Record-:-' + recordNum),
        PartitionKey: 'PartitionKey-' + recordNum,
        StreamName: 'mvstream1',
        SequenceNumberForOrdering: seqNum,
        ExplicitHashKey:shardId
    };

    kinesis.putRecord(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            //console.log(shardId); //success
            console.log(data); //success
            pushToStreamOrdered(recordNum + 1, data.SequenceNumber,shardId)
        }
    });

}

/**
 * Ordering per shard
 * @param {integer} recordNum 
 * @param {String} seqNum 
 */
let pushMultiShardOrdered = function (shards) {
    shards.forEach(function(shardId){
        pushToStreamOrdered(1,'1',shardId);
    })
    

}

//Use only one shard
//pushMultiShardOrdered(['1'])
//Use two shards
//pushMultiShardOrdered(['1','2','3'])
/**
 * Run the command aws kinesis describe-stream --stream-name mvstream1
 * This would return data like 
 *  {
                "ShardId": "shardId-000000000007", 
                "HashKeyRange": {
                    "EndingHashKey": "226854911280625642308916404954512140969", 
                    "StartingHashKey": "113427455640312821154458202477256070485"
                }, 
                "ParentShardId": "shardId-000000000004", 
                "AdjacentParentShardId": "shardId-000000000005", 
                "SequenceNumberRange": {
                    "StartingSequenceNumber": "49585974035301860685514275932246417411094727421581066354"
                }
            }
   The explicit hash value should be set in range of this HashKey (subtract 1)
   so that the record is routed to correct shard.
   Careful to pick only shards which are open. The open shards are one 
   which don't hvae a "EndingSequenceNumber" set in the JSON
 */
pushMultiShardOrdered(["113427455640312821154458202477256070483",
"340282366920938463463374607431768211454",
"226854911280625642308916404954512140968"])