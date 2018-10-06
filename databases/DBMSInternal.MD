DBMS_Notes.txt
TX atomicty is an illusion. DB has two fundamental questions -
* When can the result of one transaction be available to other transaction
* How is partial execution of a TX nullified
DBMS ensures that concurrently executing transactions are equivalent to SOME serial execution of the same set of transactions.
Most DBMS use some kind of locking mechanism to isolate conflicting operations that may affect one another. Generally there is a lock manager subsystem of DBMS.
For recovery purpose, DBMS maintains a additional information, separate from DB content - a journal, often called a log. A journel is a single sequence of records, called log records that are stored in one or more sequential files called journel files. The log record has header and redo-undo information. DBMS generally follows this -
* Before a change, 	create a undo log to reflect the current state. This is called WAL (write ahead log) protocol
* When TX commits, DBMS makes sure all (redo) log record of tx are in stable storage. This is called flush-log-at-commit protocol.

A relational database is a collection of relations and each relation stores entities and relationship information as tuples. The relation has a schema that defines what kind of tuple can be stored in relation. The schema information is stored in DB in a separate relation called Catalog. For example a Catalog may store information about user relation, number of columns, name etc. All schemas collectively define database schema.
As all tuples in relation are distinct, we can treat relation as a mathematical set of tuples and each tuple as an ordered list of columns. this lets you define well known set theoretic operations - projection, union, selection, cartesian product or cross product,set-difference, intersection and join. For all these , schema of output relation depends on the input relations.


