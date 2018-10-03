import AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

export default class SimpleDAO {
  static DDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
  static DOCClIENT = new AWS.DynamoDB.DocumentClient();

  static TABLE = "ScheduledEvents";
  ping() {
    console.log("pong");
  }
  listTables() {
    SimpleDAO.DDB.listTables({ Limit: 10 }, function (err: any, data: any) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Table names are ", data.TableNames);
        data.TableNames.forEach((tName: string) => {
          SimpleDAO.DDB.describeTable({ TableName: tName }, function (err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log(tName + "\n");
              console.log(data.Table.KeySchema);
            }
          });
        });

      }
    });
  }

  createTable() {
    let params = {
      AttributeDefinitions: [
        {
          AttributeName: 'SYSTEM_ID',
          AttributeType: 'S'
        },
        {
          AttributeName: 'EVENT_ID',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'SYSTEM_ID',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'EVENT_ID',
          KeyType: 'RANGE'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: SimpleDAO.TABLE,
      StreamSpecification: {
        StreamEnabled: false
      }
    };

    // Call DynamoDB to create the table
    SimpleDAO.DDB.createTable(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }

  addEventItemLowLevelAPI(sysId: string, eventId: string, counter: number) {
    let params = {
      Item: {
        "SYSTEM_ID": {
          S: sysId
        },
        "EVENT_ID": {
          S: eventId
        },
        "EVENT_PAYLOAD": {
          M: {
            "name": { S: "foobar" + counter },
            "ancestors": { SS: ["folder" + counter, "folder" + ++counter] }
          }
        }
      },
      ReturnConsumedCapacity: "TOTAL",
      TableName: SimpleDAO.TABLE
    };
    SimpleDAO.DDB.putItem(params, function (err: any, data: any) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });

  }

  addEventItemDocClient(sysId: string, eventId: string, counter?: number, eventPayload?: Object) {
    let i=counter||0
    let payload = eventPayload || ({
      "name": "foobardc" + i,
      "ancestors": ["folder" + i, "folder" + ++i]
    })
    var params = {
      TableName: SimpleDAO.TABLE,
      Item: {
        SYSTEM_ID: sysId,
        EVENT_ID: eventId,
        EVENT_PAYLOAD: payload //this serializes the object to JSON (not JSON.Stringify())
      }
    };



    SimpleDAO.DOCClIENT.put(params, function (err, data) {
      if (err) console.log(err);
      else console.log(data);
    });
  }

  getData(sysId: string, eventId: string) {
    var params = {
      ExpressionAttributeValues: {
        ':s': sysId,
        ':e': eventId,
      },
      KeyConditionExpression: 'SYSTEM_ID = :s and EVENT_ID = :e',
      TableName: SimpleDAO.TABLE
    };

    SimpleDAO.DOCClIENT.query(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Items);
      }
    });
  }

  queryData(sysId: string, eventId: string, queryExp:string) {
    var params = {
      ExpressionAttributeValues: {
        ':s': sysId,
        ':e': eventId,
        ':payload':queryExp
      },
      KeyConditionExpression: 'SYSTEM_ID = :s and EVENT_ID = :e',
      FilterExpression: 'contains (EVENT_PAYLOAD, :payload)',
      TableName: SimpleDAO.TABLE
    };

    SimpleDAO.DOCClIENT.query(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Items);
      }
    });
  }

} 