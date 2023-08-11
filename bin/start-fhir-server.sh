#!/bin/bash

BIN_DIR="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
. ${BIN_DIR}/probe-env.sh

[[ -z ${CONTAINER_CLI+z} ]] && { echo "No container cli available. Please install or update your path to include either docker or podman."; exit 1; }
[[ -z ${FHIR_API_PORT} ]] && { echo "FHIR_API_PORT must be set"; exit 1; }
[[ -z ${HAPI_IMAGE_REPO} ]] && { echo "HAPI_IMAGE_REPO must be set"; exit 1; }
[[ -z ${HAPI_IMAGE_NAME} ]] && { echo "HAPI_IMAGE_NAME must be set"; exit 1; }
[[ -z ${HAPI_TAG} ]] && { echo "HAPI_TAG must be set"; exit 1; }
[[ -z ${CONTAINER_NAME} ]] && { echo "CONTAINER_NAME must be set"; exit 1; }

# TODO: Check for existing container (in case there was an error previously) and clean up (or abort)?
if $(${CONTAINER_CLI} ps -a | grep ${CONTAINER_NAME} > /dev/null); then CONTAINER_EXISTS="true"; fi
if [ "${CONTAINER_EXISTS}" == "true" ]; then
    echo "Server is already running. Stop it before starting it again..."
    exit 1
fi

[[ -f ${BIN_DIR}/../fhir-server/.data/h2.mv.db ]] && DATA_EXISTS="true" || DATA_EXISTS="false"

if [ ! "${DATA_EXISTS}" == "true" ]; then
    mkdir -p $(pwd)/fhir-server/.data
    CONFIG_FILE="hapi-fhir.application.bootstrap.yaml"
    echo "Database not found, so Implementation Guide resources and dependencies will be imported. This may take 15 minutes or more. Please be patient..."
else
    CONFIG_FILE="hapi-fhir.application.yaml"
fi

CONTAINER_ID=$(${CONTAINER_CLI} run --rm -d -v $(pwd)/fhir-server/.data:/hapi/database -v $(pwd)/fhir-server/config:/hapi/config -e "--spring.config.location=file:////hapi/config/${CONFIG_FILE}" -p ${FHIR_API_PORT}:8080 --name "${CONTAINER_NAME}" "${HAPI_IMAGE_REPO}/${HAPI_IMAGE_NAME}:${HAPI_TAG}")

printf "Waiting for initialization to complete..."
until $(curl -X GET --output /dev/null --silent --head --fail http://localhost:${FHIR_API_PORT}/fhir/metadata); do
    printf '.'
    sleep 5
done

echo "Done"
