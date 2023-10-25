# FileTransfer
Final project for Cloud and Inhouse Infrastructure course in which we took a File Transfer app and we migrated it to cloud, using AWS services and Google Kubernetes for the deployment.

## Authors: 
- Cruz del Cid [CruzdelCid](https://github.com/CruzdelCid)
- Daniel Behar [dan-behar](https://github.com/dan-behar)

## Structure:
* AWS S3 to store the encoded files
* AWS DynamoDB to store the relations between the download ID, the real file name and the hashed file
* Google Kubernetes to deploy the API to upload and download

## Prerequisites:
- Have an [AWS Console account](https://github.com/CruzdelCid) and a Google Cloud account
- Have [Gcloud](https://cloud.google.com/sdk/docs/install) installed in your computer

## Building the service:
### S3
- In the AWS Console search bar go to the S3 control panel
- Create a new bucket. Be advised that the name must be unique in the whole network, be creative
- Set a region in which the bucket will be created

### DynamoDB
- In the AWS Console search bar go to the DynamoDB control panel
- Create a new Table.
  - Give to it a name and set the the Partition Key name as: **id**. Leave it as `String`.
