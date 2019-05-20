SSL and TLS

The SSL protocol was the first protocol designed for this purpose and TLS is its successor. SSL is now considered obsolete and insecure (even its latest version), so modern browsers such as Chrome or Firefox use TLS instead. As stated in a document released by IETF (RFC 7568), any TLS version is more secure than all versions of SSL. TLS 1.1 (RFC 4346) was a minor update to TLS 1.0 released in April 2006. Some of the differences in this version included protections against Cipher Block Chaining (CBC) attacks. TLS 1.2 (RFC 5246) was released in August 2008. The current version of TLS, TLS 1.3, was released in August 2018 (RFC 8446). It took IETF 10 years and 28 drafts to complete. This time, the protocol underwent some major changes with the focus on simplicity. Several unsafe technologies were removed, including SHA-1, MD5, RC4, DES, and 3DES. The protocol was streamlined for better performance: the handshake now requires only one round-trip (in some cases even zero). Other changes include encryption of SNI information for better privacy and a new signature standard (RSA-PSS). All modern browsers support TLS v1.3. 

SSL/TLS protocols use public-key cryptography. Except for encryption, this technology is also used to authenticate communicating parties.
When a secure connection is established, the server sends its SSL/TSL certificate to the client. The certificate is then checked by the client against a trusted Certificate Authority, validating the server’s identity. Such a certificate cannot be falsified, so the client may be one hundred percent sure that they are communicating with the right server.

Handshake
Step 1: Client sends a client hello to the server. it includes the following information
1) Client Version
At the start of TLS session, The client sends a list of all the TLS/SSL protocol versions that it supports with the preferred one being first on the list. For example, TLS 1.2 has a client_version 3,3. This is because TLS 1.0 is treated as a minor revision of Secure Sockets Layer (SSL 3.0), so TLS 1.0 is 3,1, TLS 1.1 is 3,2, and so on.
2) Client random - a 32 byte random number
3) Session ID - to be used for the session. empty means reuse existing
4) Compression Methods
5) Cipher Suites
6) Extensions - additional information

Step 2: After the server receives the Client Hello, it replies with Server Hello. It would contain the selected options from client hello or a handshake failure.
1) Server Version - selected option
2) Server Random - 32 byte random. the two randoms are used to generate the encrytion key. 
3) Session ID - Selected, picked from existing or a new generated
4) Compresssion Method - selected
5) Cipher suite - selected
Step 3: Server Certificate
Server sends a signed TLS cert which contains the public key of the server
Step 4: Optional Client Cert
Client to Server
Step 5: Server Key Exchange
Optional, sent only if cert provided by server is not sufficient for the client to exchange a pre-master secret.
Step 6 : Server hello done
Step 7 : Client Key Exchange -- KEY STEP---
Client to Server. 
The Client Key Exchange message is sent right after the Server Hello Done is received from the server. If the server requests a Client Certificate, the Client Key Exchange is sent after that. During this stage, the client creates a pre-master key. The pre-master secret is created by the client (the method of creation depends on the cipher suite) and then shared with the server. Before sending the pre-master secret to the server, the client encrypts it using the server public key extracted from the certificate provided by the server. This means that only the server can decrypt the message since asymmetric encryption (key pair) is used for the pre-master secret exchange.
Master Secret
After the server receives the pre-master secret key, it uses its private key to decrypt it. Now, the client and the server compute the master secret key based on random values exchanged earlier (Client Random and Server Random) using a pseudorandom function (PRF). A PRF is a function used to generate arbitrary amounts of pseudorandom data.
master_secret = PRF(pre_master_secret, "master secret", ClientHello.random + ServerHello.random) [0..47];
The master secret key, which is 48 bytes in length, will then be used by both client and server to symmetrically encrypt the data for the rest of the communication.
Step 8: Client change cipher spec
client changes the encryption. data sent from here on is encrypted using the symmetric shared key
Step 9 : Client handshake finished
Step 10: Server change cipher spec
Step 11: Server handshake finished

TLS 1.3
In the earlier version, handshake requires two round trips. One for the Hellos and other for key exchange and change of cipher spec. In 1.3 all this is done within the one roundtrip. Also, TLS compression is no longer supported.

X.509
An SSL/TLS certificate is one of the most popular types of X.509 certificates, or a type of public key certificate which uses the X.509 standard. X.509 certificates contain a public key and the identity of a hostname, organization, or individual
