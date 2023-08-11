#!/bin/bash

BIN_DIR="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
. ${BIN_DIR}/../.env

if [ -f ${BIN_DIR}/../.env.local ]; then 
    . ${BIN_DIR}/../.env.local
fi

if [ -z ${CONTAINER_CLI} ]; then
    if command -v docker &> /dev/null; then
        export CONTAINER_CLI=docker
    elif command -v podman &> /dev/null; then
        export CONTAINER_CLI=podman
    fi
fi
