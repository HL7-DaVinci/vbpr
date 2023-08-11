#!/bin//bash

BIN_DIR="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
. ${BIN_DIR}/../bin/probe-env.sh

curl http://localhost:${FHIR_API_PORT}/fhir/MeasureReport/vbp-measurereport101 -o vbp-measurereport101.json

