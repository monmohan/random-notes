### Primary Key
* Any column in a table can be established as the primary key, as long as it meets the following conditions:
* No two rows can have the same primary key value.
* Every row must have a primary key value. (Primary key columns may not allow NULL values.)
* Values in primary key columns should never be modified or updated. Most DBMSs won’t enable this, but even otherwise its not considered a good practice.
* Primary key values should never be reused. (If a row is deleted from the table, its primary key may not be assigned to any new rows in the future.)

### SQL statements 
  * are case-insensitive
  * However, be aware that while the SQL language is case-insensitive, the names of tables, columns, and values may not be (that depends  on your DBMS and how it is configured).

* DISTINCT keyword 
  * instructs the database to only return distinct values. ` SELECT DISTINCT vend_id FROM Products;`
  * The DISTINCT keyword applies to all columns, not just the one it precedes. 
  * If you were to specify `SELECT DISTINCT vend_id, prod_price,` all rows would be retrieved unless both of the specified columns were distinct.

* Limit number of rows returned , Mysql : 
  * `SELECT prod_name FROM Products LIMIT 5;` 
  * For next 5 : `SELECT prod_name FROM Products LIMIT 5 OFFSET 5;`

* Sort 
  * e.g. Sorts the products by price in descending order (most expensive first): `SELECT prod_id, prod_price, prod_name FROM Products ORDER BY prod_price DESC;`
  * In dictionary sort order, A is treated the same as a, and that is the default behavior for most Database Management Systems. However, most good DBMSs enable database administrators to change this behavior if needed. (If your database contains lots of foreign language characters, this might become necessary.)
* WHERE clause : 
  * The single quotes are used to delimit a string. If you are comparing a value against a column that is a string datatype, the delimiting quotes are required. Quotes are not used to delimit values used with numeric columns.
  `SELECT vend_id, prod_name FROM Products WHERE vend_id != 'DLL01';`
  * Use AND, OR operator : `SELECT prod_id, prod_price, prod_nameFROM ProductsWHERE vend_id = 'DLL01' AND prod_price <= 4;`
  * Whenever you write WHERE clauses that use both AND and OR operators, use parentheses to explicitly group operators. 
* IN : 
  * A keyword used in a WHERE clause to specify a list of values to be matched using an OR comparison. 
  * Example : `SELECT prod_name, prod_price FROM Products WHERE vend_id  IN ('DLL01','BRS01')ORDER BY prod_name;`
    * Its same as : `SELECT prod_name, prod_price FROM Products WHERE vend_id  = 'DLL01' OR vend_id = 'BRS01' ORDER BY prod_name;`
  * Advantage compared to OR? - IN operator can contain another SELECT statement, enabling you to build highly dynamic WHERE clauses.
* NOT
  * NOT operator has one function and one function only—NOT negates whatever condition comes next. 
  * e.g. `SELECT prod_name FROM Products WHERE NOT vend_id  = 'DLL01' ORDER BY prod_name;`
  * NOT is useful in more complex clauses. For example, using NOT in conjunction with an IN operator makes it simple to find all rows that do not match a list of criteria.

* Wildcard searching 
  * can only be used with text fields (strings), you can’t use wildcards to search fields of non-text datatypes.
  * e.g. `SELECT prod_id, prod_name FROM Products WHERE prod_name LIKE 'Fish%';`
  * Depending on our DBMS and how it is configured, searches may be case-sensitive, in which case 'fish%' would not match Fish bean bag toy.
  * % represents zero, one, or more characters at the specified location in the search pattern.
  * The underscore is used just like %, but instead of matching multiple characters the underscore matches just a single character.
  * Unlike % which can match 0 characters, _ always matches 1 character—no more and no less.

* Calculated fields
  * `SELECT Concat(vend_name, ' (', vend_country, ')') as title FROM Vendors ORDER BY vend_name;`
  * concats and creates a field called title
* Functions
  * Used as `SELECT vend_name, UPPER(vend_name) AS vend_name_upcaseFROM VendorsORDER BY vend_name;`
  * Or in where clause : `SELECT order_numFROM OrdersWHERE DATEPART('yyyy', order_date) = 2012;`	

* Aggregate Functions
  * Functions that operate on a set of rows to calculate and return a single value.
  * AVG, COUNT, MAX, MIN, SUM
  * can be combined : `SELECT COUNT(*) AS num_items, MIN(prod_price) AS price_min, MAX(prod_price) AS price_max, AVG(prod_price) AS price_avg FROM Products;`
* Grouping
  * Grouping lets you divide data into logical sets so that you can perform aggregate calculations on each group.
  * Every column listed in GROUP BY must be a retrieved column or a valid expression (but not an aggregate function). If an expression is used in the SELECT, that same expression must be specified in GROUP BY. Aliases cannot be used.
  * Group By X means put all those with the same value for X in the one group.
  * Group By X, Y means put all those with the same values for both X and Y in the one group.
```js
EXAMPLE

mysql> select vend_id, prod_price from products;
+---------+------------+
| vend_id | prod_price |
+---------+------------+
| DLL01   |       3.49 |
| DLL01   |       3.49 |
| DLL01   |       3.49 |
| BRS01   |       5.99 |
| BRS01   |       8.99 |
| BRS01   |      11.99 |
| DLL01   |       4.99 |
| FNG01   |       9.49 |
| FNG01   |       9.49 |
+---------+------------+
9 rows in set (0.00 sec)

  mysql> select vend_id, MAX(prod_price) from products group by vend_id;
+---------+-----------------+
| vend_id | MAX(prod_price) |
+---------+-----------------+
| BRS01   |           11.99 |
| DLL01   |            4.99 |
| FNG01   |            9.49 |
+---------+-----------------+
3 rows in set (0.00 sec)

mysql> select vend_id, MAX(prod_price) from products group by vend_id, prod_price;
+---------+-----------------+
| vend_id | MAX(prod_price) |
+---------+-----------------+
| BRS01   |            5.99 |
| BRS01   |            8.99 |
| BRS01   |           11.99 |
| DLL01   |            3.49 |
| DLL01   |            4.99 |
| FNG01   |            9.49 |
+---------+-----------------+
6 rows in set (0.00 sec)
```

* HAVING
  * HAVING is very similar to WHERE. In fact, all types of WHERE clauses can also be used with HAVING. The only difference is that WHERE filters rows and HAVING filters groups.
  * WHERE filters before data is grouped, and HAVING filters after data is grouped. This is an important distinction; rows that are eliminated by a WHERE clause will not be included in the group. This could change the calculated values which in turn could affect which groups are filtered based on the use of those values in the HAVING clause.
```js
mysql> select vend_id, count(*) from products group by vend_id;
+---------+----------+
| vend_id | count(*) |
+---------+----------+
| BRS01   |        3 |
| DLL01   |        4 |
| FNG01   |        2 |
+---------+----------+
3 rows in set (0.00 sec)

mysql> select vend_id, count(*) from products where prod_price >4 group by vend_id;
+---------+----------+
| vend_id | count(*) |
+---------+----------+
| BRS01   |        3 |
| DLL01   |        1 |
| FNG01   |        2 |
+---------+----------+
3 rows in set (0.00 sec)

mysql> select vend_id, count(*) as numc from products where prod_price >4 group by vend_id having numc >=2;
+---------+------+
| vend_id | numc |
+---------+------+
| BRS01   |    3 |
| FNG01   |    2 |
+---------+------+  
```

* Just because you group data one way (to obtain group specific aggregate values) does not mean that you want the output sorted that same way. You should always provide an explicit ORDER BY clause as well, even if it is identical to the GROUP BY clause.
```js
mysql> select vend_id, count(*) as numc from products where prod_price >4 group by vend_id having numc >=2 order by numc;
+---------+------+
| vend_id | numc |
+---------+------+
| FNG01   |    2 |
| BRS01   |    3 |
+---------+------+
2 rows in set (0.00 sec)
```

* Sub-Queries
  * Find all customers who have ordered product RGAN01: 

```js
SELECT cust_id

FROM Orders

WHERE order_num IN (SELECT order_num

                    FROM OrderItems

                    WHERE prod_id = 'RGAN01');
  ```

  * Tables are :

 ```js
  mysql> select * from orders;
+-----------+---------------------+------------+
| order_num | order_date          | cust_id    |
+-----------+---------------------+------------+
|     20005 | 2012-05-01 00:00:00 | 1000000001 |
|     20006 | 2012-01-12 00:00:00 | 1000000003 |
|     20007 | 2012-01-30 00:00:00 | 1000000004 |
|     20008 | 2012-02-03 00:00:00 | 1000000005 |
|     20009 | 2012-02-08 00:00:00 | 1000000001 |
+-----------+---------------------+------------+
5 rows in set (0.00 sec)

mysql> select * from orderitems;
+-----------+------------+---------+----------+------------+
| order_num | order_item | prod_id | quantity | item_price |
+-----------+------------+---------+----------+------------+
|     20005 |          1 | BR01    |      100 |       5.49 |
|     20005 |          2 | BR03    |      100 |      10.99 |
|     20006 |          1 | BR01    |       20 |       5.99 |
|     20006 |          2 | BR02    |       10 |       8.99 |
|     20006 |          3 | BR03    |       10 |      11.99 |
|     20007 |          1 | BR03    |       50 |      11.49 |
|     20007 |          2 | BNBG01  |      100 |       2.99 |
|     20007 |          3 | BNBG02  |      100 |       2.99 |
|     20007 |          4 | BNBG03  |      100 |       2.99 |
|     20007 |          5 | RGAN01  |       50 |       4.49 |
|     20008 |          1 | RGAN01  |        5 |       4.99 |
|     20008 |          2 | BR03    |        5 |      11.99 |
|     20008 |          3 | BNBG01  |       10 |       3.49 |
|     20008 |          4 | BNBG02  |       10 |       3.49 |
|     20008 |          5 | BNBG03  |       10 |       3.49 |
|     20009 |          1 | BNBG01  |      250 |       2.49 |
|     20009 |          2 | BNBG02  |      250 |       2.49 |
|     20009 |          3 | BNBG03  |      250 |       2.49 |
+-----------+------------+---------+----------+------------+
```
* Subqueries are always processed starting with the innermost SELECT statement and working outward.
* More nested subqueries -
```js
SELECT cust_name, cust_contact

FROM Customers

WHERE cust_id IN (SELECT cust_id

                  FROM Orders

                  WHERE order_num IN (SELECT order_num

                                      FROM OrderItems

                                      WHERE prod_id =

                                            'RGAN01'));
```
* Using sub query for calculated fields

```js
SELECT cust_name,

       cust_state,

       (SELECT COUNT(*)

        FROM Orders

        WHERE Orders.cust_id = Customers.cust_id) AS orders

FROM Customers

ORDER BY cust_name;
```
* Example above :pointup
  * note : Orders is a calculated field that is set by a subquery that is provided in parentheses. 
  * That subquery is executed once for every customer retrieved. 
  * In the example above, the subquery is executed five times because five customers were retrieved.

* JOIN
  * Simply put, a join is a mechanism used to associate tables within a SELECT statement (and thus the name join). 
    * When you join two tables, what you are actually doing is pairing every row in the first table with every row in the second table. The WHERE clause acts as a filter to only include rows that match the specified filter condition—the join condition, in this case. Without the WHERE clause, every row in the first table will be paired with every row in the second table, regardless of if they logically go together or not.
  * INNER JOIN = EQUI JOIN
  * Can be written as
  ```js
  SELECT vend_name, prod_name, prod_priceFROM Vendors, ProductsWHERE Vendors.vend_id = Products.vend_id;
  ```
  OR
  ```js
  SELECT vend_name, prod_name, prod_priceFROM Vendors INNER JOIN Products ON Vendors.vend_id = Products.vend_id;
  ```
  * Can join multiple tables

```js
 SELECT prod_name, vend_name, prod_price, quantity

FROM OrderItems, Products, Vendors

WHERE Products.vend_id = Vendors.vend_id

 AND OrderItems.prod_id = Products.prod_id

 AND order_num = 20007;
  ```
* Table Alias and self join
```js
SELECT c1.cust_id, c1.cust_name, c1.cust_contact

FROM Customers AS c1, Customers AS c2

WHERE c1.cust_name = c2.cust_name

 AND c2.cust_contact = 'Jim Jones';
 ```

 * Outer join - Also include rows from the (left or right table) where there is no data present
 ```js
 mysql> SELECT Customers.cust_id, Orders.order_num FROM Customers LEFT OUTER JOIN Orders ON Customers.cust_id=Orders.cust_id ; 
+------------+-----------+
| cust_id    | order_num |
+------------+-----------+
| 1000000001 |     20005 |
| 1000000001 |     20009 |
| 1000000002 |      NULL |
| 1000000003 |     20006 |
| 1000000004 |     20007 |
| 1000000005 |     20008 |
+------------+-----------+
```
### UNION
* A UNION must be composed of two or more SELECT statements, each separated by the keyword UNION (so, if combining four SELECT statements there would be three UNION keywords used). the select can be from different tables
* Each query in a UNION must contain the same columns, expressions, or aggregate functions (and some DBMSs even require that columns be listed in the same order). 
* Column datatypes must be compatible: They need not be the exact same type, but they must be of a type that the DBMS can implicitly convert (for example, different numeric types or different date types).
```js
mysql> select cust_id from customers UNION select cust_id from orders;
+------------+
| cust_id    |
+------------+
| 1000000001 |
| 1000000002 |
| 1000000003 |
| 1000000004 |
| 1000000005 |
+------------+
```
* UNION removes duplicate rows like Set functions. Use UNION ALL if duplicates are desired
* SELECT statement output is sorted using the ORDER BY clause. When combining queries with a UNION only one ORDER BY clause may be used, and it must occur after the final SELECT statement. 

### INSERT
* Insert into tablename (column list) values(value list corresponding to column list)
* Can omit the column or value if not needed, if null value is allowed for column
* INSERT SELECT - Import(Append) data from a table into existing table
```js
INSERT INTO Customers(cust_id,

                      cust_contact,

                      cust_email,

                      cust_name,

                      cust_address,

                      cust_city,

                      cust_state,

                      cust_zip,

                      cust_country)

SELECT cust_id,

       cust_contact,

       cust_email,

       cust_name,

       cust_address,

       cust_city,

       cust_state,

       cust_zip,

       cust_country

FROM CustNew;
```
* The SELECT statement used in an INSERT SELECT can include a WHERE clause to filter the data to be inserted.
* Export i.e. create a new table by exporting data from one or more tables
  * `CREATE TABLE CustCopy ASSELECT * FROM Customers;`
  * Any SELECT options and clauses may be used including WHERE and GROUP BY.
  * Joins may be used to insert data from multiple tables.
  * Data may only be inserted into a single table regardless of how many tables the data was retrieved from.

### DELETE
* When foreign keys are present, the DBMS uses them to enforce referential integrity. For example, if you tried to insert a new product into the Products table, the DBMS would not allow you to insert it with an unknown vendor id because the vend_id column is connected to the Vendors table as a foreign key. So what does this have to do with DELETE? Well, a nice side effect of using foreign keys to ensure referential integrity is that the DBMS usually prevents the deletion of rows that are needed for a relationship. For example, if you tried to delete a product from Products that was used in existing orders in OrderItems, that DELETE statement would throw an error and would be aborted. 
  * DBMSs support a feature called cascading delete. If enabled, this feature deletes all related data when a row is deleted from a table. For example, if cascading delete is enabled and a customer is deleted from the Customers table, any related order rows are deleted automatically.
* The DELETE statement deletes rows from tables, even all rows from tables. But DELETE never deletes the table itself. If you really do want to delete all rows from a table, don’t use DELETE. Instead, use the TRUNCATE TABLE statement which accomplished the same thing but does it much quicker (because data changes are not logged).
*  Never execute an UPDATE or a DELETE without a WHERE clause unless you really do intend to update and delete every row.


### VIEWS
* view creation syntax is supported pretty consistently by all the major DBMSs.
* Most common use is to hide complex queries. Other reason is to change data formatting and representation. Views can return data formatted and presented differently from their underlying tables.
* Views are generally not optimized and may be executing query or creating temporary tables(see DBMS documentation) e.g. MySQL : https://www.percona.com/blog/2007/08/12/mysql-view-as-performance-troublemaker/

### CURSORS
* A cursor is a database query stored on the DBMS server—not a SELECT statement, but the result set retrieved by that statement. Once the cursor is stored, applications can scroll or browse up and down through the data as needed.
* Not used much in web apps since its the server talking to DB

### Foreign Key
* A foreign key is a column in a table whose values must be listed in a primary key in another table. 
* Provide referential integrity

### Unique Constraints
* A table can contain multiple unique constraints, but only one primary key is allowed per table.
* Unique constraint columns can contain NULL values.
* Unique constraint columns can be modified or updated.
* Unique constraint column values can be reused.
* Unlike primary keys, unique constraints cannot be used to define foreign keys.

### Index
* PK is always indexed
* Multiple columns can be defined in an index (for example, State plus City). Such an index will be of use only when data is sorted in State plus City order. (If you want to sort by City, this index would not be of any use.)

### SQL Datatype
* You might think that phone numbers and ZIP codes should be stored in numeric fields (after all, they only store numeric data), but doing so would not be advisable. If you store the ZIP code 01234 in a numeric field, the number 1234 would be saved. You’d actually lose a digit.The basic rule to follow is: If the number is a number used in calculations (sums, averages, and so on), it belongs in a numeric datatype column. If it is used as a literal string (that happens to contain only digits), it belongs in a string datatype column.












