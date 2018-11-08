
NOTES 

HTTP
https://tools.ietf.org/pdf/rfc7234 defines HTTP cache as a local store of response messages and the subsystem that controls storage, retrieval, and deletion of messages in it. A cache stores cacheable responses in order to reduce the response time
and network bandwidth consumption on future, equivalent requests. Browsers implement HTTP caching, conforming to the RFC rules.
Use of proper HTTP header directives by your server, to instruct the browser on when and for how long the browser can cache the response, can go a long way in boosting the performance of your application by reducing unnecessary network roundtrips.

In a

cache requirements are focused on preventing a cache from either
storing a non-reusable response or reusing a stored response
inappropriately, rather than mandating that caches always store and
reuse particular responses.
Although its allowes to cache responses other than successful retrieval (200 OK) of a GET request, in practice most caches typically limit themselves to GET request response.

A response is cacheable if it 
* contains an Expires header field (see Section 5.3), or
* contains a max-age response directive (see Section 5.2.2.8), or
* contains a s-maxage response directive (see Section 5.2.2.9)
and the cache is shared, or
* contains a Cache Control Extension (see Section 5.2.3) that
allows it to be cached, or
* has a status code that is defined as cacheable by default (see
* contains a public response directive
Note that any of the requirements listed above can be overridden by a
cache-control extension;

A shared cache MUST NOT use a cached response to a request with an
Authorization header field (Section 4.2 of [RFC7235]) to satisfy any
subsequent request unless a cache directive that allows such
responses to be stored is present in the response.
In this specification, the following Cache-Control response
directives (Section 5.2.2) have such an effect: must-revalidate,
public, and s-maxage. In particular, a response with
either "max-age=0, must-revalidate" or "s-maxage=0" cannot be used to
satisfy a subsequent request without revalidating it on the origin
server.


RFC7234	: The "max-age" response directive indicates that the response is to be considered stale after its age is greater than the specified number
of seconds.	

The Last-Modified entity-header field indicates the date and time at which the origin server believes the variant was last modified.
Example of the header 
       Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT