AWS Notes
Region has two or more AZ. AZ are physically separated Data Center in the same region. AZ are geographically separated enough to provide redundancy.Edge locations are ways to cache data. AWS cloudfront uses it which is a CDN. Number of edge locations is much higher than the number of regions
Compute
EC2 is generally virtual machines
Lambda serverless
Elastic Beanstalk doesn't feature much in arch exam
Lightsail is just a fixed IP server with a management console and one can log in remotely.
Storage
EFS is a network attached file system and can be mounted on multiple virtual machines
Glacier is for archival, very very cheap
Snowball is a way to bring large amounts of data into data center. Write to disk and send over
Storage gatway are virtual machines which needs to be run in company data center so that it can replicate data to S3. 4 different kind of storage gateway
Databases
RDS, DynamoDB, Elasticache
RedShift - for datawarehousing and BI
Migration
Database Migration Service 
Migration Hub provides support to track and monitor migration
Application Discovery Service
Server Migration Service
Snowball - considered also a part of migration as well as storage.

Network and Content Delivery
Direct Connect - run a line from corporate data center to AWS VPC
Developer Tools
X-Ray in addition to others
Management Tools
cloud watch
cloud formation
Trusted Advisor - advises around different domains like security for example say there are ports open, if you are not using any service in optimal way, advise to save cost etc..
Machine Learning
Analytics
EMR - Elastic Map reduce 
and Kinesis is covered in Exam
Data Pipeline
Security
IAM
Cognito is an authentication service to give temp access to mobile devices
Inspector runs an agent on your machine. Use the agent to check for things like security vulnerabilities
CloudHSM - Hardware security module. dedicated piece of hardware to store private and public keys

From Quiz
VPC is a networking service
Route53 is a DNS service
Cloudfront is used as a CDN to distribute content around the world
Glacier for long term data archival
RDS offers database engines: SQL, MySQL, MariaDB, PostgreSQL, Aurora, and Oracle
Redshift is used for data warehousing
Kinesis is used for collating large amounts of data streamed from multiple sources
S3 durable, available storage for flat files
You need to add users to your AWS account and set password rotation policies for these new users. Which AWS service would best fit your requirements?
Answer: IAM
You need to supply auditors with logs detailing the individual users that provision specific resources on your AWS platform. Which service would best meet this need?
Answer : CloudTrail
You need a configuration management service that enables your system administrators to configure and operate your web applications using Chef. Which AWS service would best suit your needs?
Answer : Opsworks
Elastic Transcoder is used to convert their media files in to different formats to suit different devices

IAM
Provides centralized access to the AWS account as well as granular permissions. Provides temporary access for users/devices and services when necesssary.
Users
Groups: Set of users with one set of permissions
Role: Assigned to a resource. For example EC2 instance resource might me assigned a role to access S3 and then that EC2 instance can write files to S3. No need to set up username and password for that instance
Policy : is a set of permissions. a policy is applied to a user group or a role.
IAM is global, doesn't belong to a region.
username and password can't be used to programatically access the resources and access key and secret can't be used to login.

What are IAM roles?

IAM roles are a secure way to grant permissions to entities that you trust. Examples of entities include the following:

    IAM user in another account
    Application code running on an EC2 instance that needs to perform actions on AWS resources
    An AWS service that needs to act on resources in your account to provide its features
    Users from a corporate directory who use identity federation with SAML

IAM roles issue keys that are valid for short durations, making them a more secure way to grant access.

Root account has full access by default. New users have NO access by default.
You can create a custom password policy for the users.
IAM gives you centralized access of your account.
IAM allows you to integrate with existing active directory account allowing single sign on.
AWS Power user access gives access to all AWS services except allowing management of users and groups.
Policy documents are in json.


CloudFront
An edge location is where content will be cached. its separate to AWS Region or AZ. Edge locations are not just read only, you can write too. caching is based on TTL. You can clear cache but you will be charged
Origin is the origin of files which CDN would distribute. It can be S3 bucket, EC2 instance , ELB or route 53 . AWS Cloudfront works with non AWS hosted origin servers too. Multiple origins can be specified for a distribution.
Distribution - Name given to the CDN which consists of a collection of Edge locations. It can be of two types - Web Distribution which is used for web sites. RTMP which is used for media streaming.


++ Notes from training
AWS Training
partition key can only be one attribute
multiple sort keys can be defined 
string number boolean map and list
GSI has its own RCU and WCU
GSI is eventual consistent reads only
GSI can be created any time
GSI has projected columns which are returned when querying.
GSI can be deleted
LSI can be created only at the time of creating the main table.
LSI is additional sort key on the table
LSI is same partition key and different sort key than the main
LSI can't be deleted
RCU WCU is used from the main table
It has conditional writes
check out Localytics case study
API gateway supports caching
ec2-54-87-183-71.compute-1.amazonaws.com

++ finish notes from training +++






