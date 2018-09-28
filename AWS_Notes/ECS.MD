AWS_Notes_ECS
Launch type : determines which infra the tasks and services are hosted. Fargate and EC2
Task definition : JSON that describes one or more containers which make up the application
Task : Instantiation of a task definition within a cluster
Task Scheduler : Is responsible for placing the tasks within the cluster
Cluster : Group of resources that run the tasks. Fargate manages own, EC2 type will have Container instances (ami with container agent installed)
Container Agent : Runs on each resource in cluster and talks to ECS for managing tasks & monitoring
