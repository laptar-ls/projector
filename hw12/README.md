
## run project:

```bash
docker-compose up
```

## run the siege test:

```bash
chmod +x ./scripts/siege.sh
./scripts/siege.sh
```

## Performance:

### Push:

RedisAof:

```
Transactions: 16380 hits
Availability: 100.00 %
Elapsed time: 30.29 secs
Data transferred: 0.47 MB
Response time: 5.34 ms
Transaction rate: 540.77 trans/sec
Throughput: 0.02 MB/sec
Concurrency: 2.89
Successful transactions: 16380
Failed transactions: 0
Longest transaction: 6720.00 ms
Shortest transaction: 0.00 ms
```

RedisRdb:

```
Transactions: 16386 hits
Availability: 100.00 %
Elapsed time: 30.65 secs
Data transferred: 0.47 MB
Response time: 7.34 ms
Transaction rate: 534.62 trans/sec
Throughput: 0.02 MB/sec
Concurrency: 3.92
Successful transactions: 16386
Failed transactions: 0
Longest transaction: 6720.00 ms
Shortest transaction: 0.00 ms
```

Beanstalkd:

```
Transactions: 16387 hits
Availability: 100.00 %
Elapsed time: 30.17 secs
Data transferred: 0.71 MB
Response time: 5.94 ms
Transaction rate: 543.16 trans/sec
Throughput: 0.02 MB/sec
Concurrency: 3.23
Successful transactions: 16387
Failed transactions: 0
Longest transaction: 6720.00 ms
Shortest transaction: 0.00 ms
```

### Pop:

RedisAof:

```
Transactions: 16377 hits
Availability: 100.00 %
Elapsed time: 10.28 secs
Data transferred: 0.30 MB
Response time: 3.21 ms
Transaction rate: 1593.09 trans/sec
Throughput: 0.03 MB/sec
Concurrency: 5.11
Successful transactions: 16377
Failed transactions: 0
Longest transaction: 40.00 ms
Shortest transaction: 0.00 ms
```

RedisRdb:

```
Transactions: 16377 hits
Availability: 100.00 %
Elapsed time: 10.19 secs
Data transferred: 0.25 MB
Response time: 3.35 ms
Transaction rate: 1607.16 trans/sec
Throughput: 0.02 MB/sec
Concurrency: 5.39
Successful transactions: 16377
Failed transactions: 0
Longest transaction: 30.00 ms
Shortest transaction: 0.00 ms
```

Beanstalkd:

```
Transactions: 16382 hits
Availability: 100.00 %
Elapsed time: 10.20 secs
Data transferred: 1.13 MB
Response time: 3.72 ms
Transaction rate: 1606.08 trans/sec
Throughput: 0.11 MB/sec
Concurrency: 5.97
Successful transactions: 16382
Failed transactions: 0
Longest transaction: 490.00 ms
Shortest transaction: 0.00 ms
```
