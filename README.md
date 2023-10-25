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

### IAM User
This user will be the admin of thi two services.
- In the AWS Console search bar go to the IAM User control panel
- In the left panel, click users and create a new one. You can use this specs:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM1.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM2.png)
- Save the password and click NEXT
- Set the following permisions:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM3.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM4.png)
- Click NEXT. Verify that everything is correct, then create the user (don't forget to copy the password)
- Go back to the users list. Then clik on the name of your user.
- Go to Security Credentials, the search `Access Keys` and create them as follows:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM5.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM6.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM7.png)
- Save both Access and Secret Access Keys
