Networking Notes
Hub : Purpose is to connect all devices on an internal network. Its a device that has multiple ethernet ports where device connect by wire. Traffic coming at any one port is routed to ALL ports.

Switch : Same as hub except it tracks the MAC address of devices connected to it. So traffic is only sent to intended port and hence intended device.
Hubs and Switches are used to exchange data inside a local area network like home or business. Not used to exchange data outside their network.

ARP : Address resolution protocol. Host sends broadcast to all others asking the Mac Address corresponding to an IP address. For ethernet connection, IP packet which contain src and dest IP are wrapped in an ethernet frame which has src and dest Mac Address

Router : Routes data from one network to another based on IP address. Important to understand that routers connect separate networks. Its essentially the gateway of the network. When a data packet arrives at the router, it checks if its meant for its network, if yes then it recieves it otherwise it sends it off to another router.	So Routers by definition have two interfaces.

In essence, Hubs and switches create network while routers are used to connect networks.
Also Switches work at ethernet layer (2) whereas Routers at IP layer (3). 

Source: https://www.youtube.com/watch?v=1z0ULvg_pW8

Modem : Modulator/de-modulator. Needed to connect to internet because computer generate digital signal but the data travels on internet as analog. So in home the entry point is Modem. Multiple devices connect to Modem using a Router which is generally a combination of router and switch. This kind of router provides ethernet as well as wireless. Common types of Modem are DSL and cable. DSL=phone line. Ours is cable. Many times its a Modem+builtin wireless router. In addition most routers will have a builtin switch inside of them.
https://www.youtube.com/watch?v=Mad4kQ5835Y

IP address has two parts : first part is network address and second part is host address. two types , public and private . Public IP is registered and can be used to directly access the internet. Can't do that with private IP. 

NAT is used to get around the IPv4 limitation of only 4 Billion public IP addresses. Routers come inbuilt with NAT. They assign private IP to the devices and then translate for outgoing and incoming traffic. We won't need NAT or private IP because of IPv6. NAT creates a table where port on the NAT/router is mapped to corresponding local IP and port. 

The router is configured as default gateway ( On Mac , call $route get default) . 

Port forwarding on a router can be set up to map the router port to an internal IP address. Port numbers range from 0-65535. Router has both private and public IP. Mine is 192.168.0.1 and 101.127.125.155

DHCP: Static IP is where user assigns an IP address manually. A dynamic IP is where device gets IP from DHCP server. DHCP server assigns, IP address, subnet mask, default gateway and DNS Server. DHCP servers are configured with a range, start and end IP address they can dole out. IP Addresses to devices are leased not given. After some time, devices have to ask for renewal of the lease (otherwise as devices get removed they will eat slots). 

DHCP servers allow IP reservation ie. specific computer identified by MAC address will always get the same IP. Reservation is generally given to printer, router servers etc. Most routers will have DHCP service built into them. 

DNS resolves domain names to ip addresses. Device --> look in cache --> call Resolver (typically the ISP) --> call Root server --> call Top level domain server (.net, .com, .org) --> call name server 
Root Server , 380 server, 13 groups, managed by 12 organizations.
In my case, the dlink router is set up as DNS relay so the DNS server for devices is 192.168.0.1 and the router has primary and backup DNS servers configured which are 172.* i.e private DNS Servers by ISP.
msosx:~ monmohans$ nslookup google.com
Server:		192.168.0.1
Address:	192.168.0.1#53

Non-authoritative answer:
Name:	google.com
Address: 216.58.203.238

First entry is the DNS server used which is Router and the Address shows the IP and port (53).  An authoritative answer comes from a nameserver that is considered authoritative for the domain which it's returning a record for (one of the nameservers in the list for the domain you did a lookup on), and a non-authoritative answer comes from anywhere else (a nameserver not in the list for the domain you did a lookup on).
So, if we did this by changing our dns server to one of google name servers, it will authoritative
msosx:~ monmohans$ nslookup
> google.com
Server:		192.168.0.1
Address:	192.168.0.1#53

Non-authoritative answer:
Name:	google.com
Address: 216.58.203.238
> server 216.239.38.10
Default server: 216.239.38.10
Address: 216.239.38.10#53
> google.com
Server:		216.239.38.10
Address:	216.239.38.10#53

Name:	google.com
Address: 74.125.24.113
Name:	google.com
Address: 74.125.24.102


SUBNET
IP is the protocol which controls routing of information to devices. Its called a routable protocol. Routable protocols allow you to divide huge networks into smaller sub-network. Then you connect all of those sub networks using Routers. Traffic from one sub network to another goes through the router , as need be otherwise stays within the sub network. IP is Level 3 of OSI stack. IP address tells you identifier for the network as well as the device. Subnet mask tells what part of the ip address is network identifier. Even within the same physical connected networks, computers in one subnet can't talk to each other directly. Say C1 and C2 are physically connected to the same switch but are different sub net (because of the mask), they can't talk to each other directly, only through a router. This is simply how TCP/IP works.
IP = 192.168.1.1
Subnet Mask= 255.255.255.0 (Class C subnet)
Network portion is "192.168.1" and "1" is the device portion. 
So when creating the subnet, you have to figure out how many hosts you want/ how many subnets you want.

SUBNET example
Imagine a network with a total of 256 addresses (a Class C network). One of these addresses is used to identify the network address and another one is used to identify the broadcast address on the network. Therefore, we are left with 254 addresses available for addressing hosts. If we take all these addresses and divide them equally into 8 different subnets we still keep the total number of original addresses, but we have now split them into 8 subnets with 32 addresses in each. Each new subnet needs to dedicate 2 addresses for the subnet and broadcast address within the subnet.
The result is that we eventually come up with 8 subnets, each one possessing 30 addresses available for hosts. You can see that the total amount of addressable hosts is reduced (240 instead of 254) but better management of addressing space is gained.

Default gateways
If a TCP/IP computer needs to communicate with a host on another network, it will usually communicate through a device called a router. In TCP/IP terms, a router that is specified on a host, which links the host's subnet to other networks, is called a default gateway. This section explains how TCP/IP determines whether or not to send packets to its default gateway to reach another computer or device on the network.

When a host attempts to communicate with another device using TCP/IP, it performs a comparison process using the defined subnet mask and the destination IP address versus the subnet mask and its own IP address. The result of this comparison tells the computer whether the destination is a local host or a remote host.

If the result of this process determines the destination to be a local host, then the computer will simply send the packet on the local subnet. If the result of the comparison determines the destination to be a remote host, then the computer will forward the packet to the default gateway defined in its TCP/IP properties. It is then the responsibility of the router to forward the packet to the correct subnet.

Source : https://support.microsoft.com/en-sg/help/164015/understanding-tcp-ip-addressing-and-subnetting-basics
Source : https://www.youtube.com/watch?v=EkNq4TrHP_U

CIDR
IPv4 addresses were traditionally divided into five different "classes", named A through E, meant to differentiate segments of the available addressable IPv4 space. These are defined by the first four bits of each address. 
Leading bit=0, Class A (0.0.0.0 to 127.255.255.255, 127 reserved for loopback)
Leading bit=10 Class B (128.0.0.0 to 191.255.255.255)
Leading bit= 110 Class C (192.0.0.0 to 223.255.255.255)
Leading bit=1110 Class D & 1111 Class E. D is reserved for multicast and E is not used
Legacy Concept
Class A addresses used the remainder of the first octet to represent the network and the rest of the address to define hosts. The class B addresses used the first two octets (the remainder of the first, and the entire second) to define the network and the rest to define the hosts on each network. The class C addresses used the first three octets to define the network and the last octet to define hosts within that network.
Classless Inter-Domain Routing
Specify in the IP address itself the number of significant bits that make up for network portion. 
For example, we could express the idea that the IP address 192.168.0.15 is associated with the netmask 255.255.255.0 by using the CIDR notation of 192.168.0.15/24. This means that the first 24 bits of the IP address given are considered significant for the network routing.

This allows us some interesting possibilities. We can use these to reference "supernets". In this case, we mean a more inclusive address range that is not possible with a traditional subnet mask. For instance, in a class C network, like above, we could not combine the addresses from the networks 192.168.0.0 and 192.168.1.0 because the netmask for class C addresses is 255.255.255.0.

However, using CIDR notation, we can combine these blocks by referencing this chunk as 192.168.0.0/23. This specifies that there are 23 bits used for the network portion that we are referring to.

In a subnet, there are two special address
1) There is a network address itself . That's when all host bits are zero. That's the subnet identifier.
2) There is broadcast address. when all bits are set to 1. A packet sent would be sent to all hosts in network.
So usable host addresses in any subnet = 2powK -2 where k is the number of host bits.
If a Class A network was used as is, it would allow 2pow24 hosts (8 bits used for network)
Instead , steal say 16 bits from the host bits . Now same class A network would allow 2pow16 subnets and 2pow8-2 hosts per subnet.
Try this - IP= 10.15.67.128 with subnet mask as 255.255.255.192, the network address would be 10.15.67.128 and broadcast would be 10.15.67.191
Notation: If the netmask is 255.255.255.0 (or /24 for short), and the network address is 192.168.10.0, then that defines a range of IP addresses 192.168.10.0 through 192.168.10.255. Shorthand for writing that is 192.168.10.0/24.

VLAN : way to do switch partitioning to manage broadcast traffic.

PING utility also shows min/avg/max RTT. 

UDACITY COURSE
IP : Every device on internet must speak IP. its the network layer. TCP is transport layer

BGP
Each Autonomous system sends route advertisement. When an AS gets it, it will create a ROUTE . It has the details of destination AS prefix (like X.X.X.X/16), next hop ip address, typically of the router of neighbouring AS, AS Path which is sequence of AS's that the advertisement traversed to reach this AS. This is eBGP
iBGP - Same as above excpet that the information is used by routers inside AS to send traffic to other AS
IGP - Routing within the same AS

SENDING HTTP Request
(HTTPRequest) --> (TCP Header which contains source and destination port)(HTTPRequest) --> (IPHeader which contains source and destination IP)(TCP Header which contains source and destination port)(HTTPRequest) --> (Ethernet Header contains source and destination MAC Address)(IPHeader which contains source and destination IP)(TCP Header which contains source and destination port)(HTTPRequest)

IP
IP Address has two part. network id and host id. It provides connectionless packet delivery which means that it doesn't guarantee delivery or ordered either. Higher level protocols must do that. IP layer also includes ICMP, IGMP and ARP protocols.
Max length for IP packet data is 64K but normally doesn't exceed 1.5K to fit in one ethernet frame. IP header has TTL field (max number of hops allowed). TTL is reduced by 1 everytime it reaches a router and its dropped when it reaches zero. When an IP packet is passed through a router, header checksum is verified, then TTL and checksum is updated and routing table is used to determine next hop.

IP address netid is unique and provided by IANA. Routing decision are based on network id only. This reduces the size of routing table.

Routing Table
Each row in routing table contains destination address, next hop address, physical address of outgoing network interface, stats and flags. When a packet arrives, following is done in order
If complete destination address matches, forward as per next-hop
If network ID matches, forward as per next-hop
Look for Default router, forward as per next-hop
declare packet undeliverable "host unreachable error"
Example
Address 		|   Next Hop 		| 
128.56.24.0/22	|	interface0
128.56.60.0/22  |   interface1
Default         |   Router2
A packet arrives with IP address of 128.56.63.10 will be routed to interface1

CIDR Aggregation
Say a company has been assigned following addresses
128.56.25.0/24 , 128.56.26.0/24 and 128.56.27.0/24 - All this can be represented by one entry 128..56.34.0/22.
Thus CIDR addresses the routing table explosion problem. Networks are represented by network prefix and mask and contagious groups of class C addresses are aggregated if all of them use same outgoing line (common router)

However, when a packet matches multiple entries then the most specific (longest prefix) match is applied.
Example Routing table
Address 		|   Next Hop 		| 
128.56.24.0/22	|	interface0
128.56.24.0/24  |   interface1
Default         |   Router2


IP Packet with address 128.56.24.1 is sent to interface1

When multiple entries match a given IP address then the longest prefix match should be applied.


Good Question :
2. Which of the following is a valid IP host address given the network ID of 191.254.0.0 while using 11 bits for subnetting?
a. 191.254.0.32
b. 191.254.0.96
c. 191.254.1.29
d. 191.54.1.64

*Answer: Choice C is correct: 191.254.1.29. The network ID 191.254.0.0 is a Class B network address with a default subnet mask of 255.255.0.0. Adding 11 subnetting bits to the default 16-bit subnet mask yields 27 subnet bits and makes the new subnet mask 255.255.255.224. Using 11 bits for subnetting provides 2046 subnets with a maximum of 30 hosts per subnet. To fin the subnet address interval, use the following procedure. Convert the subnet mask 255.255.255.224 into binary. Next, convert the lowest order subnet bit to decimal. In this item, the decimal value of the lowest-order non-zero bit is 32. Use the decimal value of the lowest-order bit as the interval for calculating subnet IDs. The following table displays the host ID ranges for the first 10 subnets.

Subnet ID Host ID Range
191.254.0.0 191.254.0.1 -191.254.0.30
191.254.0.32 191.254.0.33 -191.254.0.62
191.254.0.64 191.254.0.65 -191.254.0.94
191.254.0.96 191.254.0.97 -191.254.0.126
191.254.0.128 191.254.0.129-191.254.0.158
191.254.0.160 191.254.0.161-191.254.0.190
191.254.0.192 191.254.0.193-191.254.0.222
191.254.0.224 191.254.0.225-191.254.0.254
191.254.1.0 191.254.1.1 -191.254.1.30
191.254.1.32 191.254.1.33 -191.254.1.62
...

As shown in the table, the IP addresses 191.254.0.32, 191.254.0.96 and 191.254.1.64 are subnet IDs in this scenario. Therefore, these IP addresses cannot be used as host IDs, given a network ID of 191.254.0.0 with 11 bits of subnetting.


IPV6
128 bits for address. 
Headers changed for efficiency. Some are dropped and some renamed, for exampple TTL is rightly called hop limit. payload can optionally be more than 64K (jumbo option). Fragmentation only happens at source, not at intermediary routers like it was in case of IPV4.

MAC Address
are 48 bits binary numbers, normally written out as 6 groups of 2 hex digits

+++
Question : Aggregate following routes
128.58.24.0/24
128.58.25.0/24
128.58.26.0/24
128.58.27.0/24
Ans: 128.58.24.0/22

===
DNS
===========
DNS is a distributed database which is partitioned into many zones which are globally replicated. Organizations connected to the internet can manage their own zones almost completely autonomously.

Domain names are inverted tree, root being special "", followed by "com", "edu" etc. as children. The "com" node represents a domain but also a namespace that contains all domains which end in .com. subdomains are domains which are contained in a parent domain so "hp.com" is a subdomain. ICANN maintains root domain and verisign maintains .com domain. This is done through delegation. The parent just contains pointers to sources of data in subdomain. The parent and child now are separate administrative zones.

DNS database is stored on name servers. A single name server can load zero, one or more zones. When a name server loads all the data for a particular zone we call it authoritative name server for that zone. That name server can answer any query for a domain name in that zone.

Resolvers are client half of name server. Usually built into OS. Resolvers can send recursive or non-recursive queries. R Q means name server returns resolved value can't return referrals. 

Query and response are two kinds of DNS message. Same format - header/question/answer/authority/additional. header and question are alwyas present but others depend if the response is referral or not. Header tells if its query, recursive or not. The question section contains domain name, class (always IN) and type (what kind of resource record needed). The answer and other sections contain resource records

Each zone has a primary as well a bunch of secondary servers. 

Resource Records are units of data stored in domain namespace. Inside a DNS message data is binary but presenentation format is following
[domain name (also called the owner)][TTL][class][type][RDATA]
domain name if it ends in . then its absolute. otherwise it is relative and should read with origin domain name appended to it. By default the origin domain name is the domain name of the zone. 
[www][3660][IN][A][50.19.85.54]
[infoblox.com.][1h][IN][MX][10 mail@inflobloxk.com]
Resource record set is a set of RR which have same domain name, class and type (try >dig ns github.com.)

[A] Record maps domain to IPv4 address. A multihomed host or a router may have the same domain mapped to many IPv4 address so it will have multiple A records.
[www][3660][IN][A][50.19.85.54]
[www][3660][IN][A][50.19.85.67]

PTR Record is reverse mapping of A i.e. map IPv4 or IPv6 address to domain name.

CNAME record creates an alias in DNS. 
[owner-name][TTL][IN][CNAME][domain-name]
[aliasname][3500][IN][CNAME][official.inflox.com]
CNAME records are singleton because they will not have any other record. Its the canonical names which will have A record. Explicit search for A record of alias will not return anything. However resolving domain names checks for alias and then uses the canonical name to return the A record.

MX is used by mail servers to determine where to send email using STMP.
[ownername][TTL][IN][MX][<16bit preference value> <mail exchanger>]
ownername is the domain name that comes after @
SRV record is generalized service record which specifies a service 
[_http _tcp .www][IN][SRV][0 0 80 www1] - Notable client to use is Minecraft

SOA record summary information for zone and attached to domain name of zone. Only one for zone.
[@][TTL][IN][SOA][<domain name of primary name server> <owner email address in dot notation> <serial number> some more data]

NS records specify the authoritative name servers for the zone.
[owner name][TTL][IN][NS][name-server]
[@][3600][IN][NS][ns1.infloblox.com]
[@][3600][IN][NS][ns2.infloblox.com]
When an authoritative name server returns list of name server for subzones (referral for recursive queries), these are returned as NS records.

Here is the top of Internet
[.][360000][NS][A.ROOT-SERVERS.NET]
[A.ROOT-SERVERS.NET][360000][A][198.41.0.4]
[A.ROOT-SERVERS.NET][360000][AAAA][Ipv6address]

When you query ".com" name server for "infoblox.com" , then it not only has to return NS record "ns1.infoblox.com" but also must return A/AAAA record of the the name server so the recursive query can now call that name server. This is called "glue". Glue is only necessary when the domain name of the name server ends in the domain name for the zone delegated to it.


Resolvers
*Nix distributions bundle a "BIND" resolver program. Windows ships its own resolver and can be configured on per network adapter.
When trying to resolve a host which doesn't have fully domain qualified (either ends in dot(.) or has at least few dots in the name), resolvers would append a domain name. so "foo" could become "foo.example.com". 
The decision is based on two things 1) having a default local domain and 2) search list of domains to append and try. Example for BIND resolver setting would be
[domain] [nxdomain.com] -- this is the local domain setting.
OR
[search] [in.infobox.com infobox.com] -- The first element would be localdomain. MS calls it "Primary DNS suffix"
Windows resolver sets local domain to AD domain name.


DIG
dig [@nameserver] name [@type]
default name server comes from resolver configuration.

1.dig @a.root-servers.net webhooks.api.autodesk.com +norec
2.dig @m.gtld-servers.net webhooks.api.autodesk.com +norec
3.dig @ns-843.awsdns-41.net  forgeweb-p-ue1.cosv2-p-ue1-dn.autodesk.com  +norec (because of the CNAME returned earlier)
4.dig @ns-546.awsdns-04.net  forgeweb-p-ue1.cosv2-p-ue1-dn.autodesk.com  +norec

If you do ">dig sadasdas.sdassingh.com A" , the response is a NXDOMAIN error, and also a SOA record indicating the name server which would have contained the domain name.

For tracing resolution try >dig +trace webhooks.api.autodesk.com

http://zytrax.com/books/dns/

DNS Relay in Router
DNS Relay means in this case that all your machines send their DNS queries to the relay.
The relay sends the queries to the DNS server of the provider or whatever is set in the router's WAN settings.
When it receives the answer it sends it back to the machines and stores it for a short time (DNS cache)













