# Projector HSA Home work #16: DDoS Attacks

## To run the project:

1. Select the type of DDoS attack you want to perform

- Uncomment the command for the desired attack in the `attacker` container in the [docker-compose](./docker-compose.yml) file

2. Run the following command:

```shell
$ docker-compose up --build
```

## Results

### HTTP flood:

```
HPING website (eth0 172.25.0.10): NO FLAGS are set, 40 headers + 0 data bytes
hping in flood mode, no replies will be shown
--- website hping statistic ---
18442975 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

### SYN flood

```
HPING website (eth0 172.25.0.10): S set, 40 headers + 0 data bytes
hping in flood mode, no replies will be shown
--- website hping statistic ---
485067 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

### UDP flood:

```
HPING website (eth0 172.25.0.10): udp mode set, 28 headers + 0 data bytes
hping in flood mode, no replies will be shown
--- website hping statistic ---
528489 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

### TCP FIN Flood

```
hping in flood mode, no replies will be shown
HPING website (eth0 172.25.0.10): F set, 40 headers + 0 data bytes
--- website hping statistic ---
865471 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

### TCP RST Flood

```
HPING website (eth0 172.25.0.10): R set, 40 headers + 0 data bytes
hping in flood mode, no replies will be shown
--- website hping statistic ---
1143846 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

### PUSH and ACK Flood

```
HPING website (eth0 172.25.0.10): AP set, 40 headers + 0 data bytes
hping in flood mode, no replies will be shown
--- website hping statistic ---
489763 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

### ICMP Flood

```
using eth0, addr: 172.25.0.20, MTU: 1500
hping in flood mode, no replies will be shown
HPING website (eth0 172.25.0.10): icmp mode set, 28 headers + 0 data bytes
--- website hping statistic ---
371511 packets tramitted, 0 packets received, 100% packet loss
round-trip min/avg/max = 0.0/0.0/0.0 ms
```

## How to protect from DDoS attacks?

### Limit Connections:

Using http module to limit the number of connections a client can open:

```nginx configuration
  server {
    location / {
      limit_conn conn_limit_per_ip 10;
    }
  }
```

### Limit Request Rates:

Limit the rate at which requests are accepted from a single IP:

```nginx configuration
  server {
    location / {
      limit_req zone=req_limit_per_ip burst=10;
    }
  }
```

### Timeout Settings:

Adjust connection timeout settings to quickly free up resources from slow clients:

```nginx configuration
client_body_timeout 10;
client_header_timeout 10;
keepalive_timeout 5 5;
send_timeout 10;
```

## Upstream Timeouts:

If you're using Nginx as a reverse proxy, configure upstream timeouts:

```nginx configuration
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```
