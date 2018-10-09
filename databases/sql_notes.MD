* Primary Key
  * Any column in a table can be established as the primary key, as long as it meets the following conditions:
  * No two rows can have the same primary key value.
  * Every row must have a primary key value. (Primary key columns may not allow NULL values.)
  * Values in primary key columns should never be modified or updated.
  * Primary key values should never be reused. (If a row is deleted from the table, its primary key may not be assigned to any new rows in the future.)

* SQL statements 
  * are case-insensitive
  * However, be aware that while the SQL language is case-insensitive, the names of tables, columns, and values may not be (that depends  on your DBMS and how it is configured).
* DISTINCT keyword 
  * instructs the database to only return distinct values. ` SELECT DISTINCT vend_idFROM Products;`
  * The DISTINCT keyword applies to all columns, not just the one it precedes. 
  * If you were to specify `SELECT DISTINCT vend_id, prod_price,` all rows would be retrieved unless both of the specified columns were distinct.

* Limit number of rows returned , Mysql : 
  * `SELECT prod_name FROM Products LIMIT 5;` 
  * For next 5 : `SELECT prod_name FROM Products LIMIT 5 OFFSET 5;`

* Sort 
  * e.g. Sorts the products by price in descending order (most expensive first): `SELECT prod_id, prod_price, prod_nameFROM ProductsORDER BY prod_price DESC;`
  * In dictionary sort order, A is treated the same as a, and that is the default behavior for most Database Management Systems. However, most good DBMSs enable database administrators to change this behavior if needed. (If your database contains lots of foreign language characters, this might become necessary.)
* WHERE clause : 
  * The single quotes are used to delimit a string. If you are comparing a value against a column that is a string datatype, the delimiting quotes are required. Quotes are not used to delimit values used with numeric columns.
  `SELECT vend_id, prod_nameFROM ProductsWHERE vend_id != 'DLL01';`
  * Use AND, OR operator : `SELECT prod_id, prod_price, prod_nameFROM ProductsWHERE vend_id = 'DLL01' AND prod_price <= 4;`
  * Whenever you write WHERE clauses that use both AND and OR operators, use parentheses to explicitly group operators. 
* IN : 
  * A keyword used in a WHERE clause to specify a list of values to be matched using an OR comparison. 
  * Example : `SELECT prod_name, prod_priceFROM ProductsWHERE vend_id  IN ('DLL01','BRS01')ORDER BY prod_name;`
    * Its same as : `SELECT prod_name, prod_priceFROM ProductsWHERE vend_id  = 'DLL01' OR vend_id = 'BRS01'ORDER BY prod_name;`
  * Advantage compared to OR? - IN operator can contain another SELECT statement, enabling you to build highly dynamic WHERE clauses.
* NOT
  * NOT operator has one function and one function only—NOT negates whatever condition comes next. 
  * e.g. `SELECT prod_nameFROM ProductsWHERE NOT vend_id  = 'DLL01'ORDER BY prod_name;`
  * NOT is useful in more complex clauses. For example, using NOT in conjunction with an IN operator makes it simple to find all rows that do not match a list of criteria.

* Wildcard searching 
  * can only be used with text fields (strings), you can’t use wildcards to search fields of non-text datatypes.
  * e.g. `SELECT prod_id, prod_nameFROM ProductsWHERE prod_name LIKE 'Fish%';`
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
  * can be combined : `SELECT COUNT(*) AS num_items,       MIN(prod_price) AS price_min,       MAX(prod_price) AS price_max,       AVG(prod_price) AS price_avgFROM Products;`
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


