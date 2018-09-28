RDBMS (MySQL)
* Used by some of the largest content services in the world today e.g. Facebook, Quora, You Tube, Twitter  and GitHub to name a few
** https://www.mysql.com/customers/

* It’s robust, replication works and it’s easy to use and run
** AWS Aurora takes this a step further making it easy to do routine maintenance tasks like provisioning, patching, backup, recovery etc.
* If we partition the data at the application level, MySQL scalability isn't an issue.
* When sharding there is choice of using simple application based routing or one of many off-the-shelf frameworks like MySQL Fabric, MaxScale, ProxySQL , MySQLRouter and so on
* Infact one can go a long way by simply "scaling up" the instance with cpu cores and tons of ram + multiple read replicas. Add a layer of distributed caching like MemCache and DB has to deal mostly with writes. 
* Tonnes of tribal knowledge available. Easy to find expert DBAs
* Continuous improvement with contributions coming in from large customers

```
The primary online data store for an application is the worst place to take a risk with new technology. If you lose your database or there's corruption, it's a disaster that could be impossible to recover from. If you're not the developer of one of these new databases, and you're one of a very small number of companies using them at scale in production, you're at the mercy of the developer to fix bugs and handle scalability issues as they come up.
Adam D'Angelo Quora CEO and Former Facebook CTO
```

NoSQL
Lets pick the most popular ones Cassandra and Dynamo 
They are what I call "table per query" style databases. Data duplication is okay, optimizing for data is anti pattern.
Partitioned from ground up (both have fairly similar concept of partition and sort key)
Work very well for key-lookup based workloads.
Global and local Secondary indexes (in Dynamo) attempt to solve some of these issues.
Cassandra : 
Had to manually create the same data in multiple tables to get secondary index. Cassandra 3+ supports materialized views now which is similar to Dynamo Global Secondary index. Proliferation of these views can become very common (In one of my services I have 6 different Materialized views for one table). 
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




https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476
https://news.ycombinator.com/item?id=14721920
https://www.allthingsdistributed.com/2018/06/purpose-built-databases-in-aws.html
