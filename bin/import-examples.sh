#!/bin/bash

# NOTE: Must run 2x due to dependencies and file name ordering
# TODO: Explicitly import examples to remove need to run twice?

BIN_DIR="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
. ${BIN_DIR}/probe-env.sh

EXAMPLE_DIR=".examples"

rm -f examples.zip
curl -s --output examples.zip https://build.fhir.org/ig/HL7/davinci-vbpr/examples.xml.zip
rm -rf ${EXAMPLE_DIR}
unzip -qq -d ${EXAMPLE_DIR}/ examples.zip
rm -f examples.zip

for EXAMPLE_FILE in $(ls -x -w 1 "${EXAMPLE_DIR}"); do
  EXAMPLE_TYPE=$(echo $EXAMPLE_FILE | cut -d "-" -f 1)
  EXAMPLE_PATH=${EXAMPLE_DIR}/${EXAMPLE_FILE}
  EXAMPLE_NAME=$(echo $EXAMPLE_FILE | cut -d "-" -f 2- | cut -d "." -f 1)

  if [ "${EXAMPLE_TYPE}" = "ImplementationGuide" ]; then # IG Naming convention is different.
    continue # TODO: Determine why this doesn't load successfully
    # EXAMPLE_NAME="hl7.fhir.us.davinci-vbpr"
  fi

  GET_RESP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${FHIR_API_PORT}/fhir/${EXAMPLE_TYPE}/${EXAMPLE_NAME})

  if [ "${GET_RESP}" = "200" ]; then
    echo "[SKIPPING] ${EXAMPLE_TYPE}/${EXAMPLE_NAME} (already exists)"
  else
    RESP_CODE=$(curl -X PUT -H "Content-Type: application/xml" -s -o /dev/null -w "%{http_code}" -d @${EXAMPLE_PATH} http://localhost:${FHIR_API_PORT}/fhir/${EXAMPLE_TYPE}/${EXAMPLE_NAME})
    if [ "${RESP_CODE}" = "201" ]; then
      echo "[LOADED] ${EXAMPLE_TYPE}/${EXAMPLE_NAME}"
    else
      echo "[ERROR (${RESP_CODE})] ${EXAMPLE_PATH} -> ${EXAMPLE_TYPE}/${EXAMPLE_NAME}"
    fi
  fi
done

rm -rf ${EXAMPLE_DIR}
