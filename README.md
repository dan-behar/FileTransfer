# FileTransfer
Final project for Cloud and Inhouse Infrastructure course in which we took a File Transfer app and we migrated it to cloud, using AWS services and Google Kubernetes for the deployment.

## Authors: 
- Cruz del Cid [CruzdelCid](https://github.com/CruzdelCid)
- Daniel Behar [dan-behar](https://github.com/dan-behar)

## Structure:
* AWS S3 to store the encoded files
* AWS DynamoDB to store the relations between the download ID, the real file's name and the hashed file
* Google Kubernetes to deploy the API to upload and download

## Prerequisites:
- Have an [AWS Console account](https://github.com/CruzdelCid) and a Google Cloud account
  - WARNING: The Google Kubernetes service is a little bit expensive (including in AWS). We suggest to create a new account and use the $300 gift that Google Cloud gives to deploy without charges
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
This user will be the admin of both services.
- In the AWS Console search bar go to the IAM User control panel
- In the left panel, click users and create a new one. You can use this specs:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM1.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM2.png)
- Save the password and click NEXT
- Set the following permissions:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM3.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM4.png)
- Click NEXT. Verify that everything is correct, then create the user (don't forget to copy the password)
- Go back to the users list. Then click on the name of your user.
- Go to Security Credentials, then search `Access Keys` and create them as follows:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM5.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM6.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/IAM7.png)
- Save both Access and Secret Access Keys

### Kubernetes
- Go to the Google Cloud Console
- Search in the console search bar **Kubernetes Clusters**. Enable it if necessary
- Create a new Kubernetes cluster. It will take a while. Image for reference:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Kub1.png)
- Copy the connection code when the cluster is created. Image for reference:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Kub2.png)

### In your computer
Some images reference to the process we did in Windows, hence some steps could change in iOS or Linux.
The app (server.js and it's dependencies) is already dockerized and stored in a Docker Container. That container is referenced in the Kubernetes Manifest.
- Open Gcloud
  - Double-left click in the program Icon (image for reference). If it is the first time, it will ask to authenticate using Google Auth services
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Cod2.png)
- Using `cd`, move to the directory in which you want to download the repo
- Execute: `git clone https://github.com/dan-behar/FileTransfer` and `cd FileTransfer/ks_manifest`
- Open a text editor and edit the *app-deployment.yaml* file. Edit the value fields (image for reference):
  - Your access key
  - Your access secret id
  - The AWS Bucket name
  - The AWS DynamoDB table name
  - The AWS region
    ![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Cod1.png)
Now we are going to install **Kubectl**. Here is the [link](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_kubectl) to install it. **Just do the steps detailed in the following photos:**
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Cod3.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Cod4.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Cod5.png)
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Cod6.png)
- Paste the connection code from the Kubernetes cluster in Google and execute it
- Execute: `kubectl apply -f app-deployment.yaml`
- Execute: `kubectl get pods`
  - If READY is 0/1, wait until it gets 1/1
- Execute: `kubectl describe pods <YOUR_POD_NAME>`. This just to verify that the global envs were loaded correctly
  - If there is a problem with the global envs: change the app-deployment.yaml file, save it and run again all the `kubectl` commands (except the connection) 
- Execute: `kubectl apply -f app-service.yaml`
- Execute: `kubectl get services`
- Copy the EXTERNAL_IP in your browser and start sharing files!

## After Usage
AWS S3 and Kubernetes have a fee for use. To ensure that everything will stop so it will not continue charging us:
### Kubernetes:
- Go to the Google Cloud Console
- Search in the console search bar **Kubernetes Clusters**
- Erase the cluster. Image for reference:
![Image text](https://github.com/dan-behar/FileTransfer/blob/main/images/Kub3.png)
After this you will need to build again the cluster

### S3
- In the AWS Console search bar go to the S3 control panel
- Click your bucket name
- Select all your files and in **actions** erase them

### DynamoDB
This service doesn't have a fee, but because we erased the files it is tracking, it is better to erase all the data
- In the AWS Console search bar go to the DynamoDB control panel
- In the left panel click Tables
- Click your table name and after that click the orange button: Explore table items
- Select all the items and in **actions** erase them
