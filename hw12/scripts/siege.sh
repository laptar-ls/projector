#!/bin/bash

TIME=10s
CONCURRENT=10

echo "[API] Starting creating users with $CONCURRENCY concurrency and $TIME time."
siege -c$CONCURRENT -t$TIME -f scripts/pop.txt
echo "[API] Creating users finished."