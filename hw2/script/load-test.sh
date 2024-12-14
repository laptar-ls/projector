#!/bin/bash

BASE_URL="http://localhost:8080"

NUM_REQUESTS=1000
CONCURRENCY=10

echo "Start MongoDB (/mongo)..."
ab -n $NUM_REQUESTS -c $CONCURRENCY -p load-data.json -T 'application/json' $BASE_URL/mongo

echo "Start Elasticsearch (/elastic)..."
ab -n $NUM_REQUESTS -c $CONCURRENCY -p load-data.json -T 'application/json' $BASE_URL/elastic

