Notes on different widely used database technologies - SQL (focussed on most popular choice -MySQL, NoSQL (Cassandra and DynamoDB), GraphDB, and NewSQL (Spanner and Cosmos))

## MySQL

* Used by some of the largest content services in the world today e.g. 
  * Facebook, Quora, You Tube, Twitter  and GitHub to name a few
  * https://www.mysql.com/customers/

* It’s robust, replication works and it’s easy to use and run

* Aurora by AWS is a MySQL managed service which takes this one step further by providing many goodies OOTB
  * Redundant storage across AZ, multiple Read replicas with load balancing
  * Autoscaling storage, SSD based virtualized storage
  * Automated routine tasks like provisioning, patching, backup, failover, recovery etc.
  * [Better performance characteristics](https://d1.awsstatic.com/product-marketing/Aurora/RDS_Aurora_Performance_Assessment_Benchmarking_v1-2.pdf) than standard MySQL
  * DR - Support replicas in differen region

* MySQL scalability isn't an issue, if you partition the data at the application level. And there are many ways to do it -

  * Using simple application based routing  
  * Using an off-the-shelf frameworks like MaxScale, ProxySQL, MySQLRouter, MySQL Fabric,  etc.


* In fact, one can go a long way by simply "scaling up" the instance with cpu cores and tons of ram + multiple read replicas. 
  * Reads can be fronted by a distributed caching like MemCache and DB has to deal mostly with writes. 

* Tonnes of tribal knowledge available. Easy to find expert DBAs
  * Plenty of good examples on how to design and scale with flexible schema. e.g. [Uber Schemaless Design](https://eng.uber.com/schemaless-part-one/) and [Friendfeed's](https://backchannel.org/blog/friendfeed-schemaless-mysql)

* Huge commuity, continuous improvement of the tech stack with contributions coming in from large adopters
  * e.g. New features like JSON type to support document style storge, index-able virtual generated columns 



## Cassandra

* Although not as common as MySQL, Cassandra is being used at large scale by few customers 		
  * Netflix run hunderds of clusters with over 10000 nodes and Petabytes of Data serving millions of transactions per second. Uses it to store customer details, viewing history, bookmarks and even billing and payment
  * Apple reported to have 75000 Nodes with 10 PB of data (they may have moved to different database now)
* Capacity scales linearly, can use commodity hardware
* Fault tolerant
  * No single point of failure (master free architecture)
  * Automatically replicated (cross AZ,DC,Region)
* Data Modelling - Support for collection data types like Map, Set, List as well as User Defined Type
* High performance for Writes
  * Works great for append only, relatively immutable data with minimal updates and deletions 
  * Tombstones(special deletion records), cause heap pressure and other related issues	
  * Row and Batch level atomicity for writes. Lightweight transaction support using conditional writes	
* Table per Query model. Data duplication is okay, optimizing for data is anti pattern.
  * Create the same data in multiple tables to get secondary index. (Cassandra 3+ supports materialized views now which does the same job OOTB)
  * Proliferation of materialized views can become very common (In one of my services I have 6 different Materialized views for one table).
* High Operational Complexity
  * Monitoring the ring. Manual recovery and repair operations, understanding processes such as compaction, memtables, sstables etc.
  * Most companies running this at scale have build custom tools to manage Cassandra clusters
  * None of Big 3 AWS,GCP or Azure provide Cassandra as managed Service
  * Other providers : [DataStax Enterprise](https://www.datastax.com/) provides cassandra as a service with administration, monitoring, developer tooling etc.


## AWS Dynamo DB
* Fully managed by AWS, scales horizontally and built for denormalized views of data
  * Essentially a Key value store that also supports document attribute type
  * Schemaless Data Modelling with support for Scalar, Document (JSON) and Set types
  * HTTP(S) API , no persistent connection
* Proven to work at scale, Over 100K customers with large enterprise adoption - Lyft, AirBnB, Expedia, duolingo to name a few
  * DynamoDB served over [12.9 million requests per second on AWS Prime day](https://aws.amazon.com/blogs/aws/prime-day-2017-powered-by-aws/)
  * https://aws.amazon.com/solutions/case-studies/
* "Table per Query" model, similar to Cassandra
  * Aggregate and keep instantiated views in table which can be read in one shot (e.g. customer and orders together)
  * Create Global and local secondary indexes for native filtering on non-key attributes
  * GSI is similar to Cassandra Materialized views, a copy of original table. LSI is per partition
  * Row(Item) level atomic writes. Lightweight Transaction support using conditional writes.
* Throughput provisioning
  * DyanmoDB provides two independent throughput control/knobs - Read capacity (RCU) and Write capacity (WCU)
  * Provisioned on per Table/GSI basis
  * RCU and WCU are table data are uniformly spread across partitions of the Table. See [partitioning math](#AWS-DynamoDB-Partitioning-Math) in Appendix
  * If sustained throughput goes beyond provisioned throughput then throttling is done. - Most common cause is non-uniform workloads which cause "hot keys" i.e. bulk of traffic going to one partition
    * [Adaptive Capacity](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html#bp-partition-key-partitions-adaptive) can address this to some extent
  * GSI provisioned throughput is separate from the provisioned throughput settings of the table.
* Important Limits
  * Item(Row) size, including LSI size, is limited to 400KB 
  * 5 global secondary indexes and 5 local secondary indexes per table.
* DynamoDB Accelerator(DAX)
  * Managed, clustered in-memory cache for DyanmoDB for read heavy and burst workloads.
  * Write through cache, can reduce RCU requirements for read heavy workloads
* DyanmoDB Streams + Lambda
  * Powerful execution framework to build real time aggregation or other views of your data
  * Much superior to Stored procedures in RDBMS

## Quick Comparison between SQL and NoSQL
### Cost
Its hard to quanitify without actual data and workload but in general Aurora is `~`20% more expensive than MySQL RDS.
DynamoDB charging is based on provisioned IO unlike Aurora which is based on used IO. Note that GSI provisioned IO is separate from main table. Large AWS Customers have reported a decrease in operational cost of up to 40-50% by moving from Dynamo to Aurora.

### Scaling
All three solutions can scale linearly and provide HA when designed right.

### Efficient Querying & Flexible Data Modelling
MySQL would lead the pack being most flexible in terms how and what you want to index. Both Cassandra and DynamoDB indexes are materialized views (copy of main table). Note that primary goal for DynamoDB is low latency key based queries with high throughput and fast ingestion of data. DynamoDB schemaless nature provides more flexibility than MySQL but improvements like JSON type support in MySQL have bridged that gap. BTW, Don't consider Schemas to be all evil. Schemas enforce type on the persisted data of your application, they serve as documentation, and in many case would prevent bugs. 

### Operational Complexity
DyanmoDB and Aurora are AWS managed solutions with DynamoDB being fully managed (no need to choose instance types tc.). Most companies running Cassandra at scale have devised their own tools to manage the clusters. DataStax provides managed cassandra but with none of Big 3 (Azure,AWS,GCP), so its hard to see its adoption growing.


### Trust and experience
Can you trust the system to be stable at scale? Do you have enough experience in your teams with this technology? Is it easy or hard to find solution to the problems you encounter when using this system?
MySQL wins hands down on these parameters. DynamoDB is a solid solution too but its proprietary in nature (and don't forget the cost :P)


## Graph Database: Neo4J
TBD

## NewSQL: Cosmos
TBD



## Appendix
 

##### AWS DynamoDB Partitioning Math
  - By Capactity = (Total RCU)/3000 + (Total WCU)/1000
  - By Size = Total Size/10 GB
  - Total partitions = MAX(By Capacity, By Size)
  - Example: 
    - Table Size = 8GB, RCU=5K, WCU=0.5K
    - = 3 Partition. RCU =5K/3= 1.7K per partition and WCU=0.5/3=166.7 and data per partition = 10/3= 3.33 GB


##### References
* https://dev.mysql.com/doc/refman/5.7/en/json.html?ff=nopfpls
* https://dev.mysql.com/doc/refman/5.7/en/create-table-generated-columns.html
* https://www.youtube.com/watch?v=60QumD2QsF0
* http://highscalability.com/blog/2011/12/19/how-twitter-stores-250-million-tweets-a-day-using-mysql.html
* https://aws.amazon.com/blogs/database/level-up-your-games-with-amazon-aurora/
* https://www.datastax.com/dev/blog/basic-rules-of-cassandra-data-modeling
* https://opencredo.com/cassandra-good-bad-ugly-webinar-recording/
* https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476
* https://news.ycombinator.com/item?id=14721920
* https://www.allthingsdistributed.com/2018/06/purpose-built-databases-in-aws.html
* https://www.youtube.com/watch?v=bCW3lhsJKfw
* https://www.reddit.com/r/aws/comments/98xbpv/folks_dont_get_me_started_on_dynamodb/
* https://www.percona.com/blog/2018/07/17/when-should-i-use-amazon-aurora-and-when-should-i-use-rds-mysql/

