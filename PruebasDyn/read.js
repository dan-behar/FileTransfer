import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
  const command = new PutCommand({
    TableName: "FileTrans",
    Item: {
      id: 1,
      path: "danielbehar",
      hashname: "srher45",
      originalName: "tester",
      password: "",
      downloadCount: 1
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
};

