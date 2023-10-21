var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const docClient = new AWS.DynamoDB.DocumentClient();

docClient.put({
  TableName: 'FileTrans',
  Item: {
    id: 1,
    path: "danielbehar",
    hashname: "srher45",
    originalName: "tester",
    password: "",
    downloadCount: 1
  }
}, (err, data)=>{
  if(err) {
      console.log(err);
  } else {
      console.log(data);
  }
});