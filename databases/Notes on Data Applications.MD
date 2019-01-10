Notes on Data Applications , 
Distributed Systems
++++
Anything that can go wrong will go wrong. (Experienced systems operators will tell you that is a reasonable assumption. 
In the end, our task as engineers is to build systems that do their job (i.e., meet the guaranteesthat users are expecting), in spite of everything going wrong. 

Partial Failure
An individual computer with good software is usually either fully functional or entirely broken, but not somethingin between.This is a deliberate choice in the design of computers: if an internal fault occurs, we prefer acomputer to crash completely rather than returning a wrong result, because wrong results are difficultand confusing to deal with. This design goal of always-correct computation goes allthe way back to the very first digital computer

Key Requirements
If the system can tolerate failed nodes and still keep working as a whole, that is a very useful feature for operations and maintenance: for example, you can perform a rolling upgrade , restarting one node at a time, while the service continues serving users withoutinterruption. In cloud environments, if one virtual machine is not performing well, you can justkill it and request a new one (hoping that the new one will be faster). 
It is important toconsider a wide range of possible faults—even fairly unlikely ones—and to artificially createsuch situations in your testing environment to see what happens. In distributed systems,suspicion, pessimism, and paranoia pay off.

In other words, we need to build a reliablesystem from unreliable components. intuitively it may seem like a system can only be asreliable as its least reliable component (its weakest link). This is not the case:
For example:
1) Error-correcting codes allow digital data to be transmitted accurately across a communicationchannel that occasionally gets some bits wrong, for example due to radio interference on awireless network .
2) IP (the Internet Protocol) is unreliable: it may drop, delay, duplicate, or reorder packets.TCP (the Transmission Control Protocol) provides a more reliable transport layer on top of IP: itensures that missing packets are retransmitted, duplicates are eliminated, and packets arereassembled into the order in which they were sent. There is always a limit to how much more reliable it can be. For example, error-correcting codes can deal with a small number ofsingle-bit errors, but if your signal is swamped by interference, there is a fundamental limit tohow much data you can get through your communication channel[13].TCP can hide packet loss, duplication, and reordering from you, but it cannot magically remove delaysin the network.
Unreliable Networks
If you send a request and don’t get a response, it’s not possible to distinguish whether (a) the request was lost, (b) the remote node is down, or (c) the response was lost. The sender can’t even tell whether the packet was delivered: the only option is for the recipient to send a response message, which may in turn be lost or delayed. These issues are indistinguishable in an asynchronous network: the only information you have is that you haven’t received a response yet.If you send a request to another node and don’t receive a response, it is impossible to tell why.
If a router is sure that the IP address you’re trying to connect to is unreachable, it may replyto you with an ICMP Destination Unreachable packet. However, the router doesn’t have a magic failure detection capability either—it is subject to the same limitations as other participantsof the network.

Network Faults in Practice
One study in a medium-sized datacenter found about 12 network faults per month, of which halfdisconnected a single machine, and half disconnected an entire rack[15].Another study measured the failure rates of components like top-of-rack switches, aggregationswitches, and load balancers[16].It found that adding redundant networking gear doesn’t reduce faults as much as you might hope, since itdoesn’t guard against human error (e.g., misconfigured switches), which is a major cause of outages.

Network Congestion
If several different nodes simultaneously try to send packets to the same destination, the networkswitch must queue them up and feed them into the destination network link one by one (as illustratedin Figure 8-2). On a busy network link, a packet may have to wait a whileuntil it can get a slot (this is called network congestion). If there is so much incoming datathat the switch queue fills up, the packet is dropped, so it needs to be resent—even thoughthe network is functioning fine.

Managing timeouts to handle network delays
Distributed systems would be a lot simpler if we could rely on the network to deliver packets withsome fixed maximum delay, and not to drop packets. But that is not the case. As a good solution, rather than using configured constant timeouts, systems can continually measureresponse times and their variability (jitter), and automatically adjust timeouts according to theobserved response time distribution. This can be done with a Phi Accrual failure detector[30],which is used for example in Akka and Cassandra [31].TCP retransmission timeouts also work similarly[27].

How does a telephone call work?
When you make a call over the telephone network, it establishes a circuit: a fixed, guaranteedamount of bandwidth is allocated for the call, along the entire route between the two callers. Thiscircuit remains in place until the call ends[32].For example, an ISDN network runs at a fixed rate of 4,000 frames per second. When a call isestablished, it is allocated 16 bits of space within each frame (in each direction). Thus, for theduration of the call, each side is guaranteed to be able to send exactly 16 bits of audio data every250 microseconds
Circuit vs. packet switched
If datacenter networks and the internet were circuit-switched networks, it would be possible toestablish a guaranteed maximum round-trip time when a circuit was set up. However, they are not:Ethernet and IP are packet-switched protocols, which suffer from queueing and thus unbounded delaysin the network. These protocols do not have the concept of a circuit.Why do datacenter networks and the internet use packet switching? The answer is that they areoptimized for bursty traffic. A circuit is good for an audio or video call, which needs totransfer a fairly constant number of bits per second for the duration of the call. On the otherhand, requesting a web page, sending an email, or transferring a file doesn’t have any particularbandwidth requirement—we just want it to complete as quickly as possible.
Dynamic usage
A similar situation arises with CPUs: if you share each CPU core dynamically between severalthreads, one thread sometimes has to wait in the operating system’s run queue while another threadis running, so a thread can be paused for varying lengths of time. However, this utilizes thehardware better than if you allocated a static number of CPU cycles to each thread . Variable delays in networks are not a law of nature, but simply the result of a cost/benefittrade-off.

Clocks 
Time of day clocks return current day and time and usually synchronized with NTP. can drift and jump back in time
A monotonic clock is suitable for measuring a duration . The absolute value is meaningless. They are guaranteed to move forward.
Comparing value from two different systems/clocks doens't make sense.

Spanner and True Time API
Google’s TrueTime API in Spanner[41], which explicitly reports theconfidence interval on the local clock. When you ask it for the current time, you get back twovalues: [earliest, latest], which are the earliest possible and the latest possibletimestamp. Ba
Spanner implements snapshot isolation across datacenters in this way[59,60].It uses the clock’s confidence interval as reported by the TrueTime API, and is based on thefollowing observation: if you have two confidence intervals, each consisting of an earliest andlatest possible timestamp (A = [Aearliest, Alatest] andB = [Bearliest, Blatest]), and those two intervals do not overlap (i.e.,Aearliest < Alatest < Bearliest < Blatest), then B definitely happened after A—there can be no doubt. Only if the intervals overlap are we unsure in which order A and B happened.In order to ensure that transaction timestamps reflect causality, Spanner deliberately waits for thelength of the confidence interval before committing a read-write transaction. By doing so, itensures that any transaction that may read the data is at a sufficiently later time, so theirconfidence intervals do not overlap. In order to keep the wait time as short as possible, Spannerneeds to keep the clock uncertainty as small as possible; for this purpose, Google deploys a GPSreceiver or atomic clock in each datacenter, allowing clocks to be synchronized to within about7 ms 

Pauses 
A node in a distributed system must assume that its execution can be paused for a significant lengthof time at any point, even in the middle of a function. During the pause, the rest of the worldkeeps moving and may even declare the paused node dead because it’s not responding. Eventually,the paused node may continue running, without even noticing that it was asleep until it checks itsclock sometime later.

System Models and correctness of algorithm
Of various different models, partially synchronous model with crash-recovery characteristics are most realistic.
Partial synchrony means that a system behaves like a synchronous system most of the time, but itsometimes exceeds the bounds for network delay, process pauses, and clock drift. While nodes may crash at any moment, and perhaps start responding again after someu nknown time. In the crash-recovery model, nodes are assumed to have stable storage (i.e.,nonvolatile disk storage) that is preserved across crashes, while the in-memory state is assumedto be lost.

An algorithm is correct in some system model if it always satisfies its properties in all situationsthat we assume may occur in that system model. 


Consistency and Consensus
++++++
The best way of building fault-tolerant systems is to find some general-purpose abstractions with useful guarantees, implement them once, and then let applications rely on those guarantees. This is the same approach as we used with transactions. By using a transaction, the application can pretend that there are no crashes (atomicity), that nobody else is concurrently accessing the database (isolation), and that storage devices are perfectly reliable (durability).Even though crashes, race conditions, and disk failures do occur, the transaction abstraction hides those problems so that the application doesn’t need to worry about them. One of the most importantabstractions for distributed systems is consensus: that is, getting all of the nodes to agree onsomething.


Serializability vs. Linearizability
Former is a property of Tx isolation which means that the Tx behave as if they were applied in some serial order. Later is a recency guarantee on reads and writes of a single object.
serializable snapshot isolation (see “Serializable Snapshot Isolation (SSI)”) is not linearizable: bydesign, it makes reads from a consistent snapshot, to avoid lock contention between readers andwriters. The whole point of a consistent snapshot is that it does not include writes that are morerecent than the snapshot, and thus reads from the snapshot are not linearizable.

Although linearizability is a useful guarantee, surprisingly few systems are actually linearizablein practice. For example, even RAM on a modern multi-core CPU is not linearizable[43]:if a thread running on one CPU core writes to a memory address, and a thread on another CPU corereads the same address shortly afterward, it is not guaranteed to read the value written by thefirst thread (unless a memory barrier or fence[44]is used).The reason for this behavior is that every CPU core has its own memory cache and store buffer.Memory access first goes to the cache by default, and any changes are asynchronously written out tomain memory. Since accessing data in the cache is much faster than going to main memory[45], this feature is essential forgood performance on modern CPUs. However, there are now several copies of the data (one in mainmemory, and perhaps several more in various caches), and these copies are asynchronously updated, solinearizability is lost. The reason for dropping linearizability is performance, not fault tolerance.
 Attiya and Welch [47]prove that if you want linearizability, the response time of read and write requests is at leastproportional to the uncertainty of delays in the network. In a network with highly variable delays,like most computer networks (see “Timeouts and Unbounded Delays”), the response time of linearizablereads and writes is inevitably going to be high. A faster algorithm for linearizability does notexist, but weaker consistency models can be much faster, so this trade-off is important forlatency-sensitive systems.

Causality
We said that two operations are concurrent if neither happened before the other (see“The “happens-before” relationship and concurrency”). Put another way, two events are ordered if they are causallyrelated (one happened before the other), but they are incomparable if they are concurrent. This means that causality defines a partial order, not a total order: some operations are orderedwith respect to each other, but some are incomparable.Therefore, according to this definition, there are no concurrent operations in a linearizabledatastore: there must be a single timeline along which all operations are totally ordered. Theremight be several requests waiting to be handled, but the datastore ensures that every request ishandled atomically at a single point in time, acting on a single copy of the data, along a singletimeline, without any concurrency. Linearizability implies causality: any system that is linearizable will preserve causalitycorrectly. However, making a system linearizable can harm its performance and availability, especially if the system has significantnetwork delays (for example, if it’s geographically distributed).

A middle ground is possible. Linearizability is not the only way of preserving causality—there are other ways too. A system can be causally consistent without incurring the performance hit of making it linearizable (in particular, the CAP theorem does not apply). In fact,causal consistency is the strongest possible consistency model that does not slow down due to network delays, and remains available in the face of network failures. This is topic of active research in databases.

In order to determine the causal ordering, the database needs to know which version of the data was read by the application. This is why, the version number from the prior operation is passed back to the database on a write. A similar idea appears in the conflict detection of SSI, as discussed in “Serializable Snapshot Isolation (SSI)”: when a transaction wants to commit, the database checks whether the version of the data that it read is still up to date. To this end, the database keeps track of which data has been read by whicht ransaction.

CAP
CAP is sometimes presented as Consistency, Availability, Partition tolerance: pick 2 out of 3.Unfortunately, putting it this way is misleading because network partitions are a kind offault, so they aren’t something about which you have a choice: they will happen whether you like it or not[38].At times when the network is working correctly, a system can provide both consistency(linearizability) and total availability. When a network fault occurs, you have to choose betweeneither linearizability or total availability. Thus, a better way of phrasing CAP would beeither Consistent or Available when Partitioned[39]. A more reliable network needs tomake this choice less often, but at some point the choice is inevitable.

Lamport timestamp = {node_counter, node_id}
LT1 & K=LT2 compare means compare counter and if they are equal then compare node_id
Key idea is that all clients and nodes are aware of the highest counter. When a request is made to a node with counter that client has, and if that node local counter is less than client counter its moved forward to client value. Preserves causal ordering and creates a total order. The problem here is that the total order of operations only emerges after you have collected all ofthe operations.

Total Order Broadcast
is usually described as a protocol for exchanging messages between nodes.Informally, it requires that two safety properties always be satisfied:
1) Reliable delivery: No messages are lost: if a message is delivered to one node, it is delivered to all nodes.
2) Totally ordered delivery: Messages are delivered to every node in the same order.
Total order broadcast is exactly what you need for database replication: if every message represents a write to the database, and every replica processes the same writes in the same order, then the replicas will remain consistent with each other (aside from any temporary replication lag). This principle is known as state machine replication.
So, total order broadcast is equivalent to repeated rounds of consensus (each consensus decisioncorresponding to one message delivery):
Due to the agreement property of consensus, all nodes decide to deliver the same messages in thesame order.
Due to the integrity property, messages are not duplicated.
Due to the validity property, messages are not corrupted and not fabricated out of thin air.
Due to the termination property, messages are not lost.

Stream Processing

LinkedIn’s Databus[25], Facebook’s Wormhole[26], and Yahoo!’s Sherpa[27] use this idea at largescale. Bottled Water implements CDC for PostgreSQL using an API that decodes the write-ahead log[28],Maxwell and Debezium do something similar for MySQL by parsing the binlog[29,30, 31],Mongoriver reads the MongoDB oplog[32, 33],and GoldenGate provides similar facilities for Oracle[34,35].


This design has theoperational advantage that adding a slow consumer does not affect the system of record too much, but ithas the downside that all the issues of replication lag apply .
In a log-structured storage engine, an update with a special null value (a tombstone) indicatesthat a key was deleted, and causes it to be removed during log compaction. But as long as a key isnot overwritten or deleted, it stays in the log forever. The disk space required for such acompacted log depends only on the current contents of the database, not the number of writes thathave ever occurred in the database. If the same key is frequently overwritten, previous values willeventually be garbage-collected, and only the latest value will be retained.The same idea works in the context of log-based message brokers and change data capture. If the CDCsystem is set up such that every change has a primary key, and every update for a key replaces theprevious value for that key, then it’s sufficient to keep just the most recent write for aparticular key.
This log compaction feature is supported by Apache Kafka. As we shall see later in this chapter, itallows the message broker to be used for durable storage, not just for transient messaging.
Transaction logs record all the changes made to the database. High-speed appends are the only way tochange the log. From this perspective, the contents of the database hold a caching of the latestrecord values in the logs. The truth is the log. The database is a cache of a subset of the log.That cached subset happens to be the latest value of each record and index value from the log.


In Chapter 9 we discussed the problems in the traditional implementations of distributedtransactions, such as XA. However, in more restricted environments it is possible to implement suchan atomic commit facility efficiently. This approach is used in Google Cloud Dataflow[81,92] and VoltDB[94],and there are plans to add similar features to Apache Kafka[95, 96]. Unlike XA, these implementations do not attempt to provide transactions across heterogeneous technologies, but instead keep them internal by managing both state changes and messaging within the stream processing framework. The overhead of the transaction protocol can be amortized by processing several inputmessages within a single transaction.



AMQP/JMS-style message broker
The broker assigns individual messages to consumers, and consumers acknowledge individual messageswhen they have been successfully processed. Messages are deleted from the broker once they havebeen acknowledged. This approach is appropriate as an asynchronous form of RPC (see also“Message-Passing Dataflow”), for example in a task queue, where the exact order of messageprocessing is not important and where there is no need to go back and read old messages againafter they have been processed.
Log-based message broker
The broker assigns all messages in a partition to the same consumer node, and always deliversmessages in the same order. Parallelism is achieved through partitioning, and consumers tracktheir progress by checkpointing the offset of the last message they have processed. The brokerretains messages on disk, so it is possible to jump back and reread old messages if necessary.











