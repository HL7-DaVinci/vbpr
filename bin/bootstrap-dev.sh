#!/bin/bash

BIN_DIR="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")"
. ${BIN_DIR}/probe-env.sh

[[ -f fhir-server/.data/h2.mv.db ]] && DATA_EXISTS="true" || DATA_EXISTS="false"

echo "Starting FHIR server"

./bin/start-fhir-server.sh

if [ ! "${DATA_EXISTS}" == "true" ]; then
    echo "Importing IG examples..."

    ./bin/import-examples.sh
    ./bin/import-examples.sh # Run twice to ensure dependencies are met
fi

cd ${BIN_DIR}/../web-app
echo "Starting web app..."
npm install
npm run dev
