import AWS =require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

export default class SimpleDAO{
  static DDB = new AWS.DynamoDB({apiVersion: '2012-10-08'});
  ping(){
    console.log("pong");
  }
  listTables(){
    SimpleDAO.DDB.listTables({Limit: 10}, function(err:any, data:any) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Table names are ", data.TableNames);
      }
    });
  }

} 