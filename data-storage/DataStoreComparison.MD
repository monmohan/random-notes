A Comparison of different widely used data storage technologies - SQL (focussed on most popular choice -MySQL, NoSQL and New Kids (NewSQL?)

## MySQL

* Used by some of the largest content services in the world today e.g. Facebook, Quora, You Tube, Twitter  and GitHub to name a few
  * https://www.mysql.com/customers/
* It’s robust, replication works and it’s easy to use and run
* Aurora by AWS is a MySQL managed service which takes this one step further by providing many goodies OOTB
  * Redundant storage across AZ, multiple Read replicas with load balancing
  * Autoscaling storage, SSD based virtualized storage
  * Automated routine tasks like provisioning, patching, backup, failover, recovery etc.
  * DR - Support replicas in differen region

* MySQL scalability isn't an issue, if you partition the data at the application level. And there are many ways to do it -

  * Using simple application based routing  
  * Using an off-the-shelf frameworks like MaxScale, ProxySQL, MySQLRouter, MySQL Fabric,  etc.

* In fact, one can go a long way by simply "scaling up" the instance with cpu cores and tons of ram + multiple read replicas. 
  * Reads can be fronted by a distributed caching like MemCache and DB has to deal mostly with writes. 
* Tonnes of tribal knowledge available. Easy to find expert DBAs
* Huge commuity, continuous improvement of the tech stack with contributions coming in from large adopters


> The primary online data store for an application is the worst place to take a risk with new technology. If you lose your database or there's corruption, it's a disaster that could be impossible to recover from. If you're not the developer of one of these new databases, and you're one of a very small number of companies using them at scale in production, you're at the mercy of the developer to fix bugs and handle scalability issues as they come up. 
Adam D'Angelo Quora CEO and Former Facebook CTO


## Cassandra

* Although not as common as MySQL, Cassandra is being used at large scale by few customers 		
  * Netflix run hunderds of clusters with over 10000 nodes and Petabytes of Data serving millions of transactions per second
  * Netflix uses it to store customer details viewing history bookmarks billing and payment
  * Apple reported to have 75000 Nodes with 10 PB of data (they may have moved to different database now)
* Capacity scales linearly, can use commodity hardware
* Fault tolerant
  * No single point of failure (master free architecture)
  * Automatically replicated (cross AZ,DC,Region)
* Data Modelling - Support for collection data types like Map, Set, List as well as User Defined Type
* High performance for Writes
  * Works great for append only, read, no delete model
  * Tombstones(special deletion records), cause heap pressure and other related issues		
* Table per Query model. Data duplication is okay, optimizing for data is anti pattern.
  * Create the same data in multiple tables to get secondary index. (Cassandra 3+ supports materialized views now which does the same job OOTB)
  * Proliferation of materialized views can become very common (In one of my services I have 6 different Materialized views for one table).
* High Operational Complexity
  * Monitoring the ring. Manual recovery and repair operations, understanding processes such as compaction, memtables, sstables etc.
  * Most companies running this at scale have build custom tools to manage Cassandra clusters
  * None of Big 3 AWS,GCP or Azure provide Cassandra as managed Service
  * Other providers : DataStax Enterprise https://www.datastax.com/ provides cassandra as a service with administration, monitoring, developer tooling etc.


Partitioned from ground up (both have fairly similar concept of partition and sort key)
Work very well for key-lookup based workloads.
Global and local Secondary indexes (in Dynamo) attempt to solve some of these issues.
Cassandra : 
 
Have had issues with too many Tombstones and deleted data re-appearing (WIPDM ran into this)
AWS doesn't offer this as managed service yet


These are great solutions, especially Dynamo as AWS managed service and many bells and whistles like auto-scaling. Fantastic for key-lookup based workloads and its very easy to throw some data and start.  
But once you need complex queries and needing to design data models around the underlying technology (like finding a well  distributed partition key) , one starts to feel the pain. Dynamo: Read and Write throughput can be tricky especially when the partition size grows and it splits.
I haven't done calculation myself but there are many reports of customers reducing cost by 40-50% by moving from Dynamo to RDS/Aurora.
https://www.youtube.com/watch?v=60QumD2QsF0&feature=youtu.be&t=17m01s
Dynamo is definitely a great solution but as a supplementary store for specializd workloads, along side a RDBMS based primary data store.
This is a common pattern that comes out from Dynamo case studies one e.g. https://aws.amazon.com/solutions/case-studies/duolingo-case-study-dynamodb/



NoSQL (Cassandra DynamoDB)

Planet Scale DBs - Spanner

Spanner is Google’s scalable, multi-version, globallydistributed, and synchronously-replicated database. It is the first system to distribute data at global scale and support externally-consistent distributed transactions




Appendix
Basic rules of data modeling in Cassandra involve manually denormalizing data into separate tables based on the queries that will be run against that table. Currently, the only way to query a column without specifying the partition key is to use secondary indexes, but they are not a substitute for the denormalization of data into new tables as they are not fit for high cardinality data. High cardinality secondary index queries often require responses from all of the nodes in the ring, which adds latency to each request. Instead, client-side denormalization and multiple independent tables are used, which means that the same code is rewritten for many different users. In 3.0, Cassandra will introduce a new feature called Materialized Views. Materialized views handle automated server-side denormalization, removing the need for client side handling of this denormalization and ensuring eventual consistency between the base and view data. This denormalization allows for very fast lookups of data in each view using the normal Cassandra read path.
In Cassandra everything is a write including logical deletion of data which results in tombstones.

https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476
https://news.ycombinator.com/item?id=14721920
https://www.allthingsdistributed.com/2018/06/purpose-built-databases-in-aws.html
https://opencredo.com/cassandra-good-bad-ugly-webinar-recording/


