## Running the Project

### Run Docker
```sh
docker compose up
```

### Run Endpoint for Seeding Users
```sh
curl http://localhost:3000/seed
```

## Indexing

After the user addition process is complete, indexes are added immediately:

```sql
ALTER TABLE users ADD INDEX idx_dob_btree (date_of_birth) USING BTREE;
ALTER TABLE users ADD INDEX idx_dob_hash (date_of_birth) USING HASH;
```

### Verify Indexes
Run the following command to check the created indexes:
```sql
SHOW INDEX FROM users;
```

### Expected Output
| # | Table | Non_unique | Key_name        | Seq_in_index | Column_name   | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible | Expression |
|---|--------|------------|----------------|--------------|---------------|-----------|-------------|----------|--------|------|------------|---------|---------------|---------|------------|
| 1 | users  | 0          | PRIMARY        | 1            | id            | A         | 39116464    |          |        |      | BTREE      |         |               | YES     |            |
| 2 | users  | 1          | idx_dob_btree  | 1            | date_of_birth | A         | 38622       |          |        |      | BTREE      |         |               | YES     |            |
| 3 | users  | 1          | idx_dob_hash   | 1            | date_of_birth | A         | 38624       |          |        |      | BTREE      |         |               | YES     |            |

We can see that both indexes are of type **BTREE**.

## Comparative Database Queries

```sql
EXPLAIN ANALYZE SELECT * FROM users
IGNORE INDEX (idx_dob_btree, idx_dob_hash)
WHERE date_of_birth = '1991-01-01'
LIMIT 100;
```
```
-> Limit: 100 row(s)  (cost=4.1e+6 rows=100) (actual time=28.6..4129 rows=100 loops=1)
-> Filter: (users.date_of_birth = DATE'1991-01-01')  (cost=4.1e+6 rows=1032) (actual time=27.6..4128 rows=100 loops=1)
-> Table scan on users  (cost=4.1e+6 rows=39.9e+6) (actual time=12.3..4031 rows=2.15e+6 loops=1)
```

```sql
EXPLAIN ANALYZE SELECT * FROM users
FORCE INDEX (idx_dob_btree)
WHERE date_of_birth = '1991-01-01'
LIMIT 100;
```
```
-> Limit: 100 row(s)  (cost=1107 rows=100) (actual time=55.1..55.2 rows=100 loops=1)
-> Index lookup on users using idx_dob_btree (date_of_birth=DATE'1991-01-01')  (cost=1107 rows=1032) (actual time=55.1..55.2 rows=100 loops=1)
```

```sql
EXPLAIN ANALYZE SELECT * FROM users
FORCE INDEX (idx_dob_hash)
WHERE date_of_birth = '1991-01-01'
LIMIT 100;
```
```
-> Limit: 100 row(s)  (cost=1052 rows=100) (actual time=4.95..4.97 rows=100 loops=1)
-> Index lookup on users using idx_dob_hash (date_of_birth=DATE'1991-01-01')  (cost=1052 rows=980) (actual time=4.95..4.96 rows=100 loops=1)
```

## Siege Performance Tests

```bash
siege -c 100 -t 60S 'http://localhost:3000/insert'
```

### Test 1: `SET GLOBAL innodb_flush_log_at_trx_commit = 0;`

```
Lifting the server siege...
Transactions:               12854    hits
Availability:                 100.00 %
Elapsed time:                  60.78 secs
Data transferred:               0.42 MB
Response time:                456.94 ms
Transaction rate:             211.48 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   96.63
Successful transactions:    12854
Failed transactions:            0
Longest transaction:         4320.00 ms
Shortest transaction:          40.00 ms
```

### Test 2: `SET GLOBAL innodb_flush_log_at_trx_commit = 1;`
```
Lifting the server siege...
Transactions:               14860    hits
Availability:                 100.00 %
Elapsed time:                  60.52 secs
Data transferred:               0.48 MB
Response time:                399.24 ms
Transaction rate:             245.54 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   98.03
Successful transactions:    14860
Failed transactions:            0
Longest transaction:         1610.00 ms
Shortest transaction:          50.00 ms
```
### Test 3: `SET GLOBAL innodb_flush_log_at_trx_commit = 2;`
```
Lifting the server siege...
Transactions:               14516    hits
Availability:                 100.00 %
Elapsed time:                  60.39 secs
Data transferred:               0.47 MB
Response time:                413.63 ms
Transaction rate:             240.37 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   99.42
Successful transactions:    14516
Failed transactions:            0
Longest transaction:         1120.00 ms
Shortest transaction:          50.00 ms
```
