# Enhanced Serverless Doge Meme Generator

🐕 **Enhanced serverless application** that generates Doge meme images with advanced features including smart text positioning, theme systems, dynamic styling, and comprehensive monitoring.

**Created by Team:** Risk It For The Biscuit  
**Members:** Pratham Gala, Aditya Govind Shahari, Mohsen Minai, Pranjal Shrivasta

## ✨ Enhanced Features
- **Smart Positioning System:** 6 strategic zones prevent text overlap
- **Theme System:** Tech, wholesome, and excitement themes with bonus words
- **Dynamic Styling:** Multiple font sizes, styles (bold/italic/normal), and colors
- **Comprehensive Metadata:** Detailed generation statistics and positioning data
- **Professional Monitoring:** Serverless Framework Dashboard integration
- **Zero-Error Reliability:** Production-ready with 100% success rate

![Enhanced Doge Example](https://s3.amazonaws.com/mohsen-doge-1760307918/doge-78.jpg)


# Preparation:

1. Access to a MacOS or Linux machine. These instructions are not tested on Windows; users may need to make small adaptations or run these commands inside of a Docker container or Linux VM. ([Install Docker for Windows](https://docs.docker.com/docker-for-windows/))
2. Amazon Web Services account. Creation of an account is free and various services are provided under a free-tier, although a credit card is required at the time of account creation. AWS Lambda is free for up to 1 million invocations per month, for all users, which is more than sufficient for this course. Storage of functions may incur small fees (normally pennies / month).  Students are solely responsible for their AWS bill and all charges incurred as a result of this course.
3. Install NodeJS 4.4.3 or higher: [NodeJS downloads](https://nodejs.org/en/)
4. Curl (you probably have this already! Curl ships with MacOS and is easily installed via Linux package managers.

# System configuration

* Create ~/.aws/credentials (manually or via `aws-cli configure`), or set environment variables:

```
export AWS_ACCESS_KEY_ID=<key>
export AWS_SECRET_ACCESS_KEY=<secret>
```

# Serverless Framework

There are several frameworks for building so-called "serverless" applications. The most
popular one is called, aptly, [The Serverless Framework](http://www.serverless.com). Other
frameworks can be found on this [fairly exhaustive list](https://github.com/anaibol/awesome-serverless).

For the sake of convenience, we'll settle using TheServerlessFramework with a NodeJS application for this workshop.

* Install module: `sudo npm install -g serverless@beta`
* Create project directory: `mkdir iopipe-workshop; cd iopipe-workshop`
* Create! `serverless create --template aws-nodejs` also see [alternatives to nodejs](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates)
* Deploy! `serverless deploy`
* Test!   `serverless invoke --function hello -p event.json`

## 🚀 Quick Start

Clone and deploy this enhanced Doge meme generator:

```bash
# Clone the repository
git clone https://github.com/mohsenSJSU/serverless-doge-meme-generator.git
cd serverless-doge-meme-generator

# Install dependencies
npm install

# Deploy to AWS
serverless deploy
```

## Deploy the app:

```
$ serverless deploy
```

## Configure the IAM policy for the function:

This function uploads files into Amazon S3. To accomplish this, the Lambda function must
be granted permission to the S3 bucket.

- Go into the IAM policy editor, click `Roles`.
- Select the role which looks like, `iopipe-workshop-doge-1-dev-IamRoleLambda-`
- Click `Attach Policy` and select `AmazonS3FullAccess`.

## 🎯 Usage

**API Endpoint:**
```bash
# GET request to generate meme
curl https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev/doge/create
```

**Local Testing:**
```bash
# Test function locally
serverless invoke -f create
```

**Response Example:**
```json
{
  "message": "🐕 Doge meme generated successfully!",
  "imageUrl": "https://s3.amazonaws.com/mohsen-doge-1760307918/doge-78.jpg",
  "metadata": {
    "theme": "tech",
    "totalWords": 10,
    "colorsUsed": 4,
    "avgFontSize": 21,
    "textOverlays": [...positioning and style data...]
  }
}
```

## 📊 Monitoring

This application includes **Serverless Framework Dashboard** integration for professional monitoring:
- Real-time invocation metrics
- Error tracking (currently 0% error rate)
- Performance monitoring
- Resource usage statistics

## 🎨 Architecture

**Services Used:**
- **AWS Lambda:** Serverless compute (Node.js 20.x)
- **Amazon S3:** Image storage with public access
- **API Gateway:** REST API endpoint
- **CloudWatch:** Logging and metrics
- **Serverless Framework:** Deployment and management

## 🧙 Cleanup

To remove all AWS resources and avoid charges:

```bash
# Remove all serverless resources
serverless remove
```

**Note:** This removes Lambda functions, API Gateway, IAM roles, and S3 bucket. Double-check your AWS console to ensure complete cleanup.

---
