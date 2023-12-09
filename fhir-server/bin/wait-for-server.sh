#!/bin/sh
FHIR_URL=$1

echo -n "Waiting for initialization to complete..."
until $(curl -X GET --output /dev/null --silent --head --fail ${FHIR_URL}/metadata); do
    echo -n '.'
    sleep 5
done
