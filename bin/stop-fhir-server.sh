#!/bin/bash

BIN_DIR="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
. ${BIN_DIR}/probe-env.sh

[[ -z ${CONTAINER_CLI+z} ]] && { echo "No container cli available. Please install or update your path to include either docker or podman."; exit 1; }
[[ -z ${CONTAINER_NAME} ]] && { echo "CONTAINER_NAME must be set"; exit 1; }

# TODO: Check for existing container (in case there was an error previously) and clean up (or abort)?
if $(${CONTAINER_CLI} ps -a | grep ${CONTAINER_NAME} > /dev/null); then CONTAINER_EXISTS="true"; fi
if [ ! "${CONTAINER_EXISTS}" == "true" ]; then
    echo "Server is not running."
    exit 1
fi

echo "Stopping server..."
${CONTAINER_CLI} stop ${CONTAINER_NAME}
