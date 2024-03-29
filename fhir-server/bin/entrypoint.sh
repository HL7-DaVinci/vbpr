FHIR_URL="${FHIR_PROTOCOL}://${FHIR_HOST}:${FHIR_API_PORT}/${FHIR_API_PATH}"

echo URL=${FHIR_URL}

echo "Waiting for initialization to complete..."
until $(curl -X GET --output /dev/null --silent --head --fail ${FHIR_URL}/metadata); do
    sleep 5
done

# NOTE: Must run 2x due to dependencies and file name ordering
./import-examples.sh ${FHIR_URL}
./import-examples.sh ${FHIR_URL}
