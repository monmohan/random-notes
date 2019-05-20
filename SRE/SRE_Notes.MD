SRE
An SRE team is responsible for the availability, latency, performance, efficiency, change management, monitoring, emergency response, and capacity planning of their service(s).

# Reliability Target 
The error budget stems from the observation that 100% is the wrong reliability target for basically everything (pacemakers and anti-lock brakes being notable exceptions). In general, for any software service or system, 100% is not the right reliability target because no user can tell the difference between a system being 100% available and 99.999% available. There are many other systems in the path between user and service (their laptop, their home WiFi, their ISP, the power grid…) and those systems collectively are far less than 99.999% available. 

#Logging
No one needs to look at this information, but it is recorded for diagnostic or forensic purposes. The expectation is that no one reads logs unless something else prompts them to do so.
#Change Management
SRE has found that roughly 70% of outages are due to changes in a live system.
Demand Forecasting and Capacity Planning
Regular load testing of the system to correlate raw capacity(servers, disks, and so on) to service capacity

#Software Infrastructure
To facilitate dashboards, monitoring, and debugging, every server has an HTTP server that provides diagnostics and statistics for a given task.

All of Google’s services communicate using a Remote Procedure Call (RPC) infrastructure named Stubby; an open source version, gRPC, is available.11 Often, an RPC call is made even when a call to a subroutine in the local program needs to be performed. This makes it easier to refactor the call into a different server if more modularity is needed, or when a server’s codebase grows. GSLB can load balance RPCs in the same way it load balances externally visible services.

A server receives RPC requests from its frontend and sends RPCs to its backend. In traditional terms, the frontend is called the client and the backend is called the server.

Data is transferred to and from an RPC using protocol buffers,12 often abbreviated to "protobufs," which are similar to Apache’s Thrift. Protocol buffers have many advantages over XML for serializing structured data: they are simpler to use, 3 to 10 times smaller, 20 to 100 times faster, and less ambiguous.


Question : Why is there no impact on latency if ALL calls go to GSLB including their interanl svc-2-svc communication?

#Time-based availability
availability=(uptime)/(uptime+downtime)
# Aggregate Availability
availability=(successful requests)/(total number of requests)

#Embracing Risk

One way to satisfy these competing constraints in a cost-effective manner is to partition the infrastructure and offer it at multiple independent levels of service. We can provide vastly different service guarantees by adjusting a variety of service characteristics, such as the quantities of resources, the degree of redundancy, the geographical provisioning constraints, and, critically, the infrastructure software configuration.

#Error Budget
Our practice is then as follows:

Product Management defines an SLO, which sets an expectation of how much uptime the service should have per quarter.
The actual uptime is measured by a neutral third party: our monitoring system.
The difference between these two numbers is the "budget" of how much "unreliability" is remaining for the quarter.
As long as the uptime measured is above the SLO—in other words, as long as there is error budget remaining—new releases can be pushed.
For example, imagine that a service’s SLO is to successfully serve 99.999% of all queries per quarter. This means that the service’s error budget is a failure rate of 0.001% for a given quarter. If a problem causes us to fail 0.0002% of the expected queries for the quarter, the problem spends 20% of the service’s quarterly error budget.

# Service level objectives
We use intuition, experience, and an understanding of what users want to define service level indicators (SLIs), objectives (SLOs), and agreements (SLAs). These measurements describe basic properties of metrics that matter, what values we want those metrics to have, and how we’ll react if we can’t provide the expected service

# SLI
An SLI is a service level indicator—a carefully defined quantitative measure of some aspect of the level of service that is provided.

Most services consider request latency—how long it takes to return a response to a request—as a key SLI. Other common SLIs include the error rate, often expressed as a fraction of all requests received, and system throughput, typically measured in requests per second. The measurements are often aggregated: i.e., raw data is collected over a measurement window and then turned into a rate, average, or percentile.
Another kind of SLI important to SREs is availability, or the fraction of the time that a service is usable. It is often defined in terms of the fraction of well-formed requests that succeed, sometimes called yield. 

# SLO
An SLO is a service level objective: a target value or range of values for a service level that is measured by an SLI. A natural structure for SLOs is thus SLI ≤ target, or lower bound ≤ SLI ≤ upper bound. For example, we might decide that we will return Shakespeare search results "quickly," adopting an SLO that our average search request latency should be less than 100 milliseconds.

Choosing an appropriate SLO is complex. To begin with, you don’t always get to choose its value! For incoming HTTP requests from the outside world to your service, the queries per second (QPS) metric is essentially determined by the desires of your users, and you can’t really set an SLO for that.

On the other hand, you can say that you want the average latency per request to be under 100 milliseconds, and setting such a goal could in turn motivate you to write your frontend with low-latency behaviors of various kinds or to buy certain kinds of low-latency equipment. 

# SLA
Finally, SLAs are service level agreements: an explicit or implicit contract with your users that includes consequences of meeting (or missing) the SLOs they contain. The consequences are most easily recognized when they are financial—a rebate or a penalty—but they can take other forms. An easy way to tell the difference between an SLO and an SLA is to ask "what happens if the SLOs aren’t met?": if there is no explicit consequence, then you are almost certainly looking at an SLO.16

# Standardize Indicators
We recommend that you standardize on common definitions for SLIs so that you don’t have to reason about them from first principles each time. Any feature that conforms to the standard definition templates can be omitted from the specification of an individual SLI, e.g.:

Aggregation intervals: “Averaged over 1 minute”
Aggregation regions: “All the tasks in a cluster”
How frequently measurements are made: “Every 10 seconds”
Which requests are included: “HTTP GETs from black-box monitoring jobs”
How the data is acquired: “Through our monitoring, measured at the server”
Data-access latency: “Time to last byte”
To save effort, build a set of reusable SLI templates for each common metric; these also make it simpler for everyone to understand what a specific SLI means.

# Objectives in Practice
Start by thinking about (or finding out!) what your users care about, not what you can measure. Often, what your users care about is difficult or impossible to measure, so you’ll end up approximating users’ needs in some way.

If you have users with heterogeneous workloads such as a bulk processing pipeline that cares about throughput and an interactive client that cares about latency, it may be appropriate to define separate objectives for each class of workload:

95% of throughput clients’ Set RPC calls will complete in < 1 s.
99% of latency clients’ Set RPC calls with payloads < 1 kB will complete in < 10 ms.

You can always refine SLO definitions and targets over time as you learn about a system’s behavior. It’s better to start with a loose target that you tighten than to choose an overly strict target that has to be relaxed when you discover it’s unattainable.
Keep a safety margin
Using a tighter internal SLO than the SLO advertised to users gives you room to respond to chronic problems before they become visible externally. An SLO buffer also makes it possible to accommodate reimplementations that trade performance for other attributes, such as cost or ease of maintenance, without having to disappoint users.


# Alerting
you should never trigger an alert simply because "something seems a bit weird." Effective alerting systems have good signal and very low noise.
In general, Google has trended toward simpler and faster monitoring systems, with better tools for post hoc analysis. We avoid "magic" systems that try to learn thresholds or automatically detect causality. 

Google SRE has experienced only limited success with complex dependency hierarchies. We seldom use rules such as, "If I know the database is slow, alert for a slow database; otherwise, alert for the website being generally slow."

# Black-Box Versus White-Box
We combine heavy use of white-box monitoring with modest but critical uses of black-box monitoring. The simplest way to think about black-box monitoring versus white-box monitoring is that black-box monitoring is symptom-oriented and represents active—not predicted—problems: "The system isn’t working correctly, right now." White-box monitoring depends on the ability to inspect the innards of the system, such as logs or HTTP endpoints, with instrumentation. White-box monitoring therefore allows detection of imminent problems, failures masked by retries, and so forth.
When collecting telemetry for debugging, white-box monitoring is essential. If web servers seem slow on database-heavy requests, you need to know both how fast the web server perceives the database to be, and how fast the database believes itself to be. Otherwise, you can’t distinguish an actually slow database server from a network problem between your web server and your database.


# The Four Golden Signals
### Latency
The time it takes to service a request. 
slow error is even worse than a fast error! Therefore, it’s important to track error latency, as opposed to just filtering out errors.


### Traffic
A measure of how much demand is being placed on your system, 
### Errors
The rate of requests that fail, either explicitly (e.g., HTTP 500s), implicitly (for example, an HTTP 200 success response, but coupled with the wrong content), or by policy (for example, "If you committed to one-second response times, any request over one second is an error"). 






