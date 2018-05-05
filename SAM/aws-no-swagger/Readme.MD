### Pre-requisites
* Setup AWS CLI
* Setup AWS .config and credentials file
* Create a S3 bucket to hold all the code etc.

### To Build and deploy

* Package : `aws cloudformation package --template-file ./input-cf.yaml --s3-bucket msingh-code --output-template-file packaged-template.yaml`
    * This should create a file `packaged-template.yaml` in your current directory
* Deploy : `aws cloudformation deploy --template-file ./packaged-template.yaml --stack-name udp-deploy-stack --capabilities CAPABILITY_IAM`

This will do all of the following 
* Transform your template as well as swagger file. 
* Upload and configure Lambda functions.
* Create and configure API in API gateway
* Create and configure integrations to Lambda functions created in Step 2
